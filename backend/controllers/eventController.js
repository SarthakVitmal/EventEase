import Event from '../models/Event.js';

const createEvent = async(req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }

        const {
            title,
            description,
            category,
            date,
            time,
            isOnline,
            meetingUrl,
            location,
            organizer,
            contactEmail,
            isPaid,
            ticketTypes,
            maxAttendees
        } = req.body;

        // Validate required fields
        const requiredFields = ['title', 'description', 'category', 'date', 'time', 'organizer', 'contactEmail'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                missingFields
            });
        }

        // Validate user authentication
        // if (!req.userId) {
        //     return res.status(401).json({ message: 'Unauthorized' });
        // }

        // Prepare ticket data
        const preparedTicketTypes = isPaid ?
            ticketTypes.map(t => ({
                name: t.name,
                price: parseFloat(t.price) || 0,
                quantity: parseInt(t.quantity) || 0
            })) :
            undefined;

        // Create event
        const event = new Event({
            title,
            description,
            category,
            date: new Date(date),
            time,
            isOnline: Boolean(isOnline),
            meetingUrl: isOnline ? meetingUrl : undefined,
            location: !isOnline ? location : undefined,
            organizer,
            contactEmail,
            contactPhone: req.body.contactPhone,
            isPaid: Boolean(isPaid),
            ticketTypes: preparedTicketTypes,
            maxAttendees: !isPaid ? parseInt(maxAttendees) || undefined : undefined,
            creator: req.user.userId,
            status: 'published',
        });

        await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            eventId: event._id,
            event: {
                title: event.title,
                date: event.date,
                status: event.status
            }
        });

    } catch (error) {
        console.error('Create event error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const getEventsByUser = async(req, res) => {
    try {
        const events = await Event.find().populate('creator', 'username email');
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAllEvents = async(req, res) => {
    try {
        // Extract query parameters
        const {
            futureOnly,
            category,
            search,
            sort,
            fromDate,
            toDate,
            page = 1,
            limit = 10
        } = req.query;

        // Build the base query
        let query = {};

        // Filter for future events only
        if (futureOnly === 'true') {
            query.date = { $gte: new Date() };
        }

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Text search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Date range filter
        if (fromDate || toDate) {
            query.date = query.date || {};
            if (fromDate) query.date.$gte = new Date(fromDate);
            if (toDate) query.date.$lte = new Date(toDate);
        }

        // Build sort options
        let sortOption = { date: 1 }; // Default: sort by date ascending
        if (sort) {
            switch (sort) {
                case 'date-desc':
                    sortOption = { date: -1 };
                    break;
                case 'price-asc':
                    sortOption = { price: 1 };
                    break;
                case 'price-desc':
                    sortOption = { price: -1 };
                    break;
                case 'popularity':
                    sortOption = { attendees: -1 };
                    break;
            }
        }

        // Get total count for pagination
        const total = await Event.countDocuments(query);

        // Fetch events with pagination
        const events = await Event.find(query)
            .populate('creator', 'username email avatarUrl')
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            events
        });

    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export default createEvent;