import User from '../models/User.js';
import Event from '../models/Event.js';
import { uploadToCloudinary } from '../cloudConfig.js';
import Participant from '../models/Participant.js';

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
            imageUrl: req.body.imageUrl,
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

export const uploadEventImage = async(req, res) => {
    try {
        // Debugging logs
        console.log('Request headers:', req.headers);
        console.log('Request file:', req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file received by the server'
            });
        }

        if (!req.file.buffer || req.file.buffer.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Received empty file buffer',
                fileInfo: {
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                }
            });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        res.status(200).json({
            success: true,
            imageUrl: result.secure_url
        });

    } catch (error) {
        console.error('Upload error:', {
            message: error.message,
            stack: error.stack,
            rawError: error
        });

        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
};

export const getEventById = async(req, res) => {
    try {
        // Support both /getEventById/:eventId and /:id
        const eventId = req.params.eventId || req.params.id;
        const event = await Event.findById(eventId)
            .populate('creator', 'username email avatarUrl');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({
            success: true,
            event: {
                id: event._id,
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
                location: event.location,
                // price: event.ticketTypes ? .[0] ? .price || 0,
                category: event.category,
                // attendees: event.attendees ? .length || 0,
                imageUrl: event.imageUrl,
                isOnline: event.isOnline,
                meetingUrl: event.meetingUrl,
                organizer: {
                    name: event.organizer,
                    // avatarUrl: event.creator ? .avatarUrl,
                    description: event.organizerDescription
                },
                ticketTypes: event.ticketTypes
            }
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const eventRegistration = async(req, res) => {
    try {
        const { eventId, userId, name, email, phone, additionalInfo } = req.body;

        // Validate eventId
        if (!eventId) {
            return res.status(400).json({ error: 'Event ID is required' });
        }

        // Check if the event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Create new participant
        const participant = new Participant({
            userId,
            eventId: eventId,
            name,
            email,
            phone,
            additionalInfo
        });

        const user = await User.findById(userId);

        // Save participant
        await participant.save();

        // Update user's events
        if (user) {
            user.events.push(eventId, );
            await user.save();
        }

        res.status(201).json({
            message: 'Registration successful',
            participant
        });
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ error: 'Failed to register for event' });
    }
};

export const getUserRegisteredEvents = async(req, res) => {
    try {
        const { id: userId } = req.params;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const user = await User.findById(userId).populate('events');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            message: 'Events fetched successfully',
            events: user.events
        });
    } catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}
export default createEvent;