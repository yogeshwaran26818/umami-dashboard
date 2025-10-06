import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/lib/models';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { websiteId } = params;
    
    // Total views (pageview events)
    const totalViews = await Event.countDocuments({
      websiteId,
      eventType: 'pageview'
    });

    // Unique visitors
    const uniqueVisitors = await Event.distinct('visitorId', { websiteId });
    const uniqueVisitorsCount = uniqueVisitors.length;

    // Total visits (sessions) - group by visitor and day
    const visits = await Event.aggregate([
      { $match: { websiteId, eventType: 'pageview' } },
      {
        $group: {
          _id: {
            visitorId: '$visitorId',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          }
        }
      },
      { $count: 'totalVisits' }
    ]);
    const totalVisits = visits[0]?.totalVisits || 0;

    // Bounce rate (visitors with only one pageview)
    const bounceRate = await Event.aggregate([
      { $match: { websiteId, eventType: 'pageview' } },
      {
        $group: {
          _id: '$visitorId',
          pageviews: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          totalVisitors: { $sum: 1 },
          bouncedVisitors: {
            $sum: { $cond: [{ $eq: ['$pageviews', 1] }, 1, 0] }
          }
        }
      }
    ]);
    
    const bounceRatePercent = bounceRate[0] 
      ? ((bounceRate[0].bouncedVisitors / bounceRate[0].totalVisitors) * 100).toFixed(1)
      : 0;

    // Average visit duration
    const avgDuration = await Event.aggregate([
      { $match: { websiteId, duration: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          averageDuration: { $avg: '$duration' }
        }
      }
    ]);
    const averageVisitDuration = avgDuration[0]?.averageDuration || 0;

    // Views over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const viewsOverTime = await Event.aggregate([
      {
        $match: {
          websiteId,
          eventType: 'pageview',
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      totalViews,
      totalVisits,
      uniqueVisitors: uniqueVisitorsCount,
      bounceRate: `${bounceRatePercent}%`,
      averageVisitDuration: Math.round(averageVisitDuration),
      viewsOverTime
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}