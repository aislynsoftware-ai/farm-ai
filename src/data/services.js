import { Bug, Leaf, Apple, HeartPulse, Brain, BarChart3 } from 'lucide-react';

const servicesData = [
  {
    id: 1,
    icon: Bug,
    title: 'Plant Disease Detection',
    description:
      'Upload an image of your plant and our AI instantly identifies diseases, pests, and nutrient deficiencies with 95% accuracy.',
    features: [
      'Instant disease identification',
      'Treatment recommendations',
      'Severity assessment',
    ],
    gradient: 'from-emerald-400 to-green-500',
  },
  {
    id: 2,
    icon: Leaf,
    title: 'Plant Identification',
    description:
      'Identify any plant species from a simple photo. Our comprehensive database covers thousands of plant species worldwide.',
    features: [
      'Species recognition',
      'Care instructions',
      'Growth information',
    ],
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    id: 3,
    icon: Apple,
    title: 'Food Identification',
    description:
      'Snap a picture of any food item and get instant nutritional information, calorie counts, and dietary insights.',
    features: [
      'Nutritional analysis',
      'Calorie estimation',
      'Dietary recommendations',
    ],
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 4,
    icon: HeartPulse,
    title: 'Crop Health Monitoring',
    description:
      'Continuous monitoring of your crop health using satellite imagery and AI analysis for early problem detection.',
    features: [
      'Satellite monitoring',
      'Health score tracking',
      'Early warning alerts',
    ],
    gradient: 'from-teal-400 to-emerald-500',
  },
  {
    id: 5,
    icon: Brain,
    title: 'AI Recommendations',
    description:
      'Get personalized farming recommendations powered by machine learning algorithms analyzing thousands of data points.',
    features: [
      'Personalized insights',
      'Weather-based advice',
      'Optimal planting times',
    ],
    gradient: 'from-green-500 to-blue-500',
  },
  {
    id: 6,
    icon: BarChart3,
    title: 'Agricultural Analytics',
    description:
      'Comprehensive analytics dashboard with detailed reports on crop performance, yield predictions, and market trends.',
    features: [
      'Yield predictions',
      'Market analysis',
      'Performance reports',
    ],
    gradient: 'from-emerald-400 to-blue-500',
  },
];

export default servicesData;
