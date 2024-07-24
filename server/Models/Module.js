const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    moduleCode: String,
    moduleCredit: Number,
    totalStudyHours: Number,
    timetabledHours: Number,
    privateStudyHours: Number,

    lectures: {
        hours: Number,
        distribution: [
            {
                week: Number,
                hours: Number
            }
        ],
    },
    seminars: {
        hours: Number,
        distribution: [
            {
                week: Number,
                hours: Number
            }
        ],
    },
    tutorials: {
        hours: Number,
        distribution: [
            {
                week: Number,
                hours: Number
            }
        ],
    },
    labs: {
        hours: Number,
        distribution: [
            {
                week: Number,
                hours: Number
            }
        ],
    },
    fieldworkPlacement: {
        hours: Number,
        distribution: [
            {
                week: Number,
                hours: Number
            }
        ],
    },
    other: {
        hours: Number,
        distribution: [
            {
                week: Number,
                hours: Number
            }
        ],
    },

    examPrep: {
        deadline: Number,
        weightage: Number,
        studyHours: Number,
        distribution: [
            {
                week: Number,
                hours: Number
            }
        ],
    },

    courseworkPrep: [
        {
            deadline: Number,
            weightage: Number,
            studyHours: Number,
            distribution: {
                earlybird: [
                    {
                        week: Number,
                        hours: Number
                    }
                ],
                moderate: [
                    {
                        week: Number,
                        hours: Number
                    }
                ],
                procrastinator: [
                    {
                        week: Number,
                        hours: Number
                    }
                ]
            }
        }
    ],

    classtestPrep: [
        {
            deadline: Number,
            weightage: Number,
            studyHours: Number,
            distribution: {
                earlybird: [
                    {
                        week: Number,
                        hours: Number
                    }
                ],
                moderate: [
                    {
                        week: Number,
                        hours: Number
                    }
                ],
                procrastinator: [
                    {
                        week: Number,
                        hours: Number
                    }
                ]
            }
        }
    ]

});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;