import { SURVEY } from '../../models/survey';

// Create a new survey
export const createSurvey = async (req, res) => {
    try {
        const newSurvey = new SURVEY(req.body);
        await newSurvey.save();
        res.status(201).json(newSurvey);
    } catch (error) {
        res.status(400).json({ message: 'Error creating survey', error });
    }
};

// Get all surveys
export const getSurveys = async (req, res) => {
    try {
        const surveys = await SURVEY.find();
        surveys.sort((a, b) => b.date - a.date);
        res.status(200).json({
            message: 'All surveys',
            surveys,
    });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching surveys', error });
    }
};

// Get a single survey by ID
export const getSurveyById = async (req, res) => {
    try {
        const survey = await SURVEY.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        res.status(200).json(survey);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching survey', error });
    }
};

// Update a survey by ID
export const updateSurvey = async (req, res) => {
    try {
        const survey = await SURVEY.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        res.status(200).json(survey);
    } catch (error) {
        res.status(400).json({ message: 'Error updating survey', error });
    }
};

// Delete a survey by ID
export const deleteSurvey = async (req, res) => {
    try {
        const survey = await SURVEY.findByIdAndDelete(req.params.id);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting survey', error });
    }
};

export const getUserSurveys = async (req, res) => {
    try {
        const userId = req.userId;
        const surveys = await SURVEY.find({ userId });
        surveys.sort((a, b) => b.date - a.date);
        res.status(200).json({
            message: 'All surveys',
            surveys,
    });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching  surveys', error });
    }
};

// Get user's weight data for the graph
export const getUserWeights = async (req, res) => {
    try {
        const userId = req.userId; 
        const surveys = await SURVEY.find({ userId }).sort({ createdAt: 1 });

        // Prepare the weight data for the graph
        const weightData = {
            labels: [],
            datasets: [
                {
                    data: [],
                },
            ],
        };

        surveys.forEach(survey => {
            // Extract the month from the createdAt field
            const month = new Date(survey.createdAt).toLocaleString('en-US', { month: 'short' });
            weightData.labels.push(month);
            weightData.datasets[0].data.push(survey.weight);
        });

        res.status(200).json({
            message: 'User weight data',
            weightData,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weight data', error });
    }
};
