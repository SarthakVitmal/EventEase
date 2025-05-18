import Event from '../models/Event.js';

const createEvent = async (req, res) => {
  try {
    // Verify request has body
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
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Prepare ticket data
    const preparedTicketTypes = isPaid 
      ? ticketTypes.map(t => ({
          name: t.name,
          price: parseFloat(t.price) || 0,
          quantity: parseInt(t.quantity) || 0
        }))
      : undefined;

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
      status: 'draft'
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


export const getEventsByUser = async (req, res) => {
    try {
        const events = await Event.find().populate('creator', 'username email');
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default createEvent;