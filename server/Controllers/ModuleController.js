const Module = require("../Models/Module");

// Fetch Data from database and send back to client
const fetchData = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Module.findOne({ moduleCode: id });
        if (data) {
            console.log(data);
            res.status(200).json(data);
        } else {
            res.status(404).send("Module not found!");
        }
    } catch (err) {
        console.log("Error in fetching module data: ", err);
        res.status(500).send("Unable to fetch module data!");
    }
};

const fetchAllCodes = async (req, res) => {
    try {
        const codes = await Module.find(
            {},
            "moduleCode moduleCredit totalStudyHours timetabledHours privateStudyHours"
        );
        if (codes && codes.length > 0) {
            res.status(200).json(codes);
        } else {
            res.status(404).send("Data not found!");
        }
    } catch (err) {
        console.log("Error in fetching modules code: ", err);
        res.status(500).send("Unable to fetch modules code!");
    }
};

//Generate all study styles distribution
const generateDistribution = (deadline, studyHours, maxStudyHours) => {
    const numWeeks = 15;
    let earlyBirdDistribution = [];
    let distributionWeeks = Math.ceil(studyHours / maxStudyHours);
    let tempStudyHours = studyHours;
    for (let week = numWeeks; week >= 1; week--) {
        const hoursForWeek =
            week <= deadline
                ? distributionWeeks > 0
                    ? tempStudyHours % maxStudyHours === 0
                        ? maxStudyHours
                        : tempStudyHours % maxStudyHours
                    : 0
                : 0;
        earlyBirdDistribution.push({
            week,
            hours:
                hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
        });
        week <= deadline && distributionWeeks--;
        week <= deadline && (tempStudyHours = tempStudyHours - hoursForWeek);
    }
    earlyBirdDistribution = earlyBirdDistribution.reverse();

    let moderateDistribution = [];
    distributionWeeks = Math.ceil(studyHours / maxStudyHours);
    const hoursPerWeek = studyHours / distributionWeeks;
    for (let week = numWeeks; week >= 1; week--) {
        const hoursForWeek =
            week <= deadline ? (distributionWeeks > 0 ? hoursPerWeek : 0) : 0;
        moderateDistribution.push({
            week,
            hours:
                hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
        });
        week <= deadline && distributionWeeks--;
    }
    moderateDistribution = moderateDistribution.reverse();

    let procrastinatorDistribution = [];
    distributionWeeks = Math.ceil(studyHours / maxStudyHours);
    tempStudyHours = studyHours;
    for (let week = numWeeks; week >= 1; week--) {
        const hoursForWeek =
            week <= deadline
                ? distributionWeeks > 0
                    ? tempStudyHours > maxStudyHours
                        ? maxStudyHours
                        : tempStudyHours
                    : 0
                : 0;
        procrastinatorDistribution.push({
            week,
            hours:
                hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
        });
        week <= deadline && distributionWeeks--;
        week <= deadline && (tempStudyHours = tempStudyHours - hoursForWeek);
    }
    procrastinatorDistribution = procrastinatorDistribution.reverse();
    // console.log('Deadline', deadline);
    // console.log('Study Hours', studyHours);
    // console.log('Early Bird: ', earlyBirdDistribution);
    // console.log('Moderate: ', moderateDistribution);
    // console.log('Proc.: ', procrastinatorDistribution);

    return {
        earlyBirdDistribution,
        moderateDistribution,
        procrastinatorDistribution,
    };
};
// console.log(generateDistribution(11, 30.8, 20));

//Algorithm for workload management
const studyWorkloadSimulatorAlgorithm = (data) => {
    const {
        moduleCode,
        moduleCredit,
        timetabledHours,
        lectures,
        seminars,
        tutorials,
        labs,
        fieldworkPlacement,
        other,
        examPrep,
        courseworkPrep,
        classtestPrep,
    } = data;
    const totalStudyHours = moduleCredit * 10;
    const privateStudyHours = totalStudyHours - timetabledHours;

    const numWeeks = 15;
    const lecturesDistribution = [];
    let hoursPerWeek = lectures / 12;
    for (let week = 1; week <= numWeeks; week++) {
        const hoursForWeek = week <= 12 ? hoursPerWeek : 0;
        lecturesDistribution.push({
            week,
            hours:
                hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
        });
    }
    const lecturesObject = {
        hours: lectures,
        distribution: lecturesDistribution,
    };
    // console.log("Lectures Object", lecturesObject);

    const seminarsDistribution = [];
    hoursPerWeek = seminars / 12;
    for (let week = 1; week <= numWeeks; week++) {
        const hoursForWeek = week <= 12 ? hoursPerWeek : 0;
        seminarsDistribution.push({
            week,
            hours:
                hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
        });
    }
    const seminarsObject = {
        hours: seminars,
        distribution: seminarsDistribution,
    };
    // console.log("Seminars Object", seminarsObject);

    const tutorialsDistribution = [];
    hoursPerWeek = tutorials / 12;
    for (let week = 1; week <= numWeeks; week++) {
        const hoursForWeek = week <= 12 ? hoursPerWeek : 0;
        tutorialsDistribution.push({
            week,
            hours:
                hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
        });
    }
    const tutorialsObject = {
        hours: tutorials,
        distribution: tutorialsDistribution,
    };
    // console.log("Tutorials Object", tutorialsObject);

    const labsDistribution = [];
    hoursPerWeek = labs / 12;
    for (let week = 1; week <= numWeeks; week++) {
        const hoursForWeek = week <= 12 ? hoursPerWeek : 0;
        labsDistribution.push({
            week,
            hours:
                hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
        });
    }
    const labsObject = {
        hours: labs,
        distribution: labsDistribution,
    };
    // console.log("Labs Object", labsObject);

    const fieldworkPlacementDistribution = [];
    hoursPerWeek = fieldworkPlacement / 12;
    for (let week = 1; week <= numWeeks; week++) {
        const hoursForWeek = week <= 12 ? hoursPerWeek : 0;
        fieldworkPlacementDistribution.push({
            week,
            hours:
                hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
        });
    }
    const fieldworkPlacementObject = {
        hours: fieldworkPlacement,
        distribution: fieldworkPlacementDistribution,
    };
    // console.log("Fieldwork Placement Object", fieldworkPlacementObject);

    const otherDistribution = [];
    hoursPerWeek = other / 12;
    for (let week = 1; week <= numWeeks; week++) {
        const hoursForWeek = week <= 12 ? hoursPerWeek : 0;
        otherDistribution.push({
            week,
            hours:
                hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
        });
    }
    const otherObject = {
        hours: other,
        distribution: otherDistribution,
    };
    // console.log("Seminars Object", otherObject);

    let maxStudyHours = Number(process.env.MAX_STUDY_HOURS);
    const examStudyHours = Number(
        ((privateStudyHours * examPrep.weightage) / 100).toFixed(2)
    );
    const examPrepDistribution = [];
    hoursPerWeek = examStudyHours / 3;
    for (let week = 1; week <= numWeeks; week++) {
        const hoursForWeek = week > 12 ? hoursPerWeek : 0;
        examPrepDistribution.push({
            week,
            hours:
                hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
        });
    }
    const examPrepObject = {
        deadline: examPrep.deadline,
        weightage: examPrep.weightage,
        studyHours: examStudyHours,
        distribution: examPrepDistribution,
    };
    // console.log("Exam Prep Object", examPrepObject);

    let courseworkStudyHours;
    const courseworkPrepObject = courseworkPrep.map((coursework) => {
        const { deadline, weightage } = coursework;
        courseworkStudyHours = Number(
            ((privateStudyHours * weightage) / 100).toFixed(2)
        );
        const {
            earlyBirdDistribution,
            moderateDistribution,
            procrastinatorDistribution,
        } = generateDistribution(deadline, courseworkStudyHours, maxStudyHours);

        return {
            deadline,
            weightage,
            studyHours: courseworkStudyHours,
            distribution: {
                earlybird: earlyBirdDistribution,
                moderate: moderateDistribution,
                procrastinator: procrastinatorDistribution,
            },
        };
    });
    // console.log("Course Work Prep Object", courseworkPrepObject);

    let classtestStudyHours;
    const classtestPrepObject = classtestPrep.map((classtest) => {
        const { deadline, weightage } = classtest;
        classtestStudyHours = Number(
            ((privateStudyHours * weightage) / 100).toFixed(2)
        );
        const {
            earlyBirdDistribution,
            moderateDistribution,
            procrastinatorDistribution,
        } = generateDistribution(deadline, classtestStudyHours, maxStudyHours);

        return {
            deadline,
            weightage,
            studyHours: classtestStudyHours,
            distribution: {
                earlybird: earlyBirdDistribution,
                moderate: moderateDistribution,
                procrastinator: procrastinatorDistribution,
            },
        };
    });
    // console.log("Class Test Prep Object", classtestPrepObject);

    const module = {
        moduleCode,
        moduleCredit,
        totalStudyHours,
        timetabledHours,
        privateStudyHours,
        lectures: lecturesObject,
        seminars: seminarsObject,
        tutorials: tutorialsObject,
        labs: labsObject,
        fieldworkPlacement: fieldworkPlacementObject,
        other: otherObject,
        examPrep: examPrepObject,
        courseworkPrep: courseworkPrepObject,
        classtestPrep: classtestPrepObject,
    };
    return module;
};

//Create Module and store it in the Database
const createModule = async (req, res) => {
    console.log('Request: ', req.body);
    try {
        const moduleData = studyWorkloadSimulatorAlgorithm(req.body);
        const newModule = new Module(moduleData);
        const savedModule = await newModule.save();
        if (savedModule) {
            console.log('Created Module: ', savedModule);
            res.status(201).send("Module Created!");
        }
    } catch (error) {
        console.log("Error while creating module: ", error);
        res.status(500).send("Internal Server Error");
    }
};

//Update already existed module
const updateModule = async (req, res) => {
    try {
        const id = req.params.id;
        const oldModule = await Module.findOne({ moduleCode: id });
        if (oldModule) {
            const newModuleData = studyWorkloadSimulatorAlgorithm(req.body);
            const updatedModule = await Module.findOneAndUpdate(
                { moduleCode: id },
                newModuleData,
                { new: true }
            );
            if (updatedModule) {
                res.status(201).json(updatedModule);
            } else {
                res.status(500).send("Unable to update module!");
            }
        } else {
            res.status(404).send("Module not found!");
        }
    } catch (error) {
        console.log("Error while creating module: ", error);
        res.status(500).send("Internal Server Error");
    }
};

//Utility Function to populate module in Database
const populateData = async () => {
    try {
        const newModule = new Module({
            moduleCode: "ELEC362",
            moduleCredit: 15,
            totalStudyHours: 150,
            timetabledHours: 42,
            privateStudyHours: 108,
            labs: {
                hours: 24,
                distribution: [
                    { week: 1, hours: 2 },
                    { week: 2, hours: 2 },
                    { week: 3, hours: 2 },
                    { week: 4, hours: 2 },
                    { week: 5, hours: 2 },
                    { week: 6, hours: 2 },
                    { week: 7, hours: 2 },
                    { week: 8, hours: 2 },
                    { week: 9, hours: 2 },
                    { week: 10, hours: 2 },
                    { week: 11, hours: 2 },
                    { week: 12, hours: 2 },
                    { week: 13, hours: 0 },
                    { week: 14, hours: 0 },
                    { week: 15, hours: 0 },
                ],
            },
            lectures: {
                hours: 12,
                distribution: [
                    { week: 1, hours: 1 },
                    { week: 2, hours: 1 },
                    { week: 3, hours: 1 },
                    { week: 4, hours: 1 },
                    { week: 5, hours: 1 },
                    { week: 6, hours: 1 },
                    { week: 7, hours: 1 },
                    { week: 8, hours: 1 },
                    { week: 9, hours: 1 },
                    { week: 10, hours: 1 },
                    { week: 11, hours: 1 },
                    { week: 12, hours: 1 },
                    { week: 13, hours: 0 },
                    { week: 14, hours: 0 },
                    { week: 15, hours: 0 },
                ],
            },
            tutorials: {
                hours: 6,
                distribution: [
                    { week: 1, hours: 0.5 },
                    { week: 2, hours: 0.5 },
                    { week: 3, hours: 0.5 },
                    { week: 4, hours: 0.5 },
                    { week: 5, hours: 0.5 },
                    { week: 6, hours: 0.5 },
                    { week: 7, hours: 0.5 },
                    { week: 8, hours: 0.5 },
                    { week: 9, hours: 0.5 },
                    { week: 10, hours: 0.5 },
                    { week: 11, hours: 0.5 },
                    { week: 12, hours: 0.5 },
                    { week: 13, hours: 0 },
                    { week: 14, hours: 0 },
                    { week: 15, hours: 0 },
                ],
            },
            seminars: {
                hours: 0,
                distribution: [
                    { week: 1, hours: 0 },
                    { week: 2, hours: 0 },
                    { week: 3, hours: 0 },
                    { week: 4, hours: 0 },
                    { week: 5, hours: 0 },
                    { week: 6, hours: 0 },
                    { week: 7, hours: 0 },
                    { week: 8, hours: 0 },
                    { week: 9, hours: 0 },
                    { week: 10, hours: 0 },
                    { week: 11, hours: 0 },
                    { week: 12, hours: 0 },
                    { week: 13, hours: 0 },
                    { week: 14, hours: 0 },
                    { week: 15, hours: 0 },
                ],
            },
            fieldworkPlacement: {
                hours: 0,
                distribution: [
                    { week: 1, hours: 0 },
                    { week: 2, hours: 0 },
                    { week: 3, hours: 0 },
                    { week: 4, hours: 0 },
                    { week: 5, hours: 0 },
                    { week: 6, hours: 0 },
                    { week: 7, hours: 0 },
                    { week: 8, hours: 0 },
                    { week: 9, hours: 0 },
                    { week: 10, hours: 0 },
                    { week: 11, hours: 0 },
                    { week: 12, hours: 0 },
                    { week: 13, hours: 0 },
                    { week: 14, hours: 0 },
                    { week: 15, hours: 0 },
                ],
            },
            other: {
                hours: 0,
                distribution: [
                    { week: 1, hours: 0 },
                    { week: 2, hours: 0 },
                    { week: 3, hours: 0 },
                    { week: 4, hours: 0 },
                    { week: 5, hours: 0 },
                    { week: 6, hours: 0 },
                    { week: 7, hours: 0 },
                    { week: 8, hours: 0 },
                    { week: 9, hours: 0 },
                    { week: 10, hours: 0 },
                    { week: 11, hours: 0 },
                    { week: 12, hours: 0 },
                    { week: 13, hours: 0 },
                    { week: 14, hours: 0 },
                    { week: 15, hours: 0 },
                ],
            },
            examPrep: {
                deadline: 15,
                weightage: 50,
                studyHours: 54,
                distribution: [
                    { week: 1, hours: 0 },
                    { week: 2, hours: 0 },
                    { week: 3, hours: 0 },
                    { week: 4, hours: 0 },
                    { week: 5, hours: 0 },
                    { week: 6, hours: 0 },
                    { week: 7, hours: 0 },
                    { week: 8, hours: 0 },
                    { week: 9, hours: 0 },
                    { week: 10, hours: 0 },
                    { week: 11, hours: 0 },
                    { week: 12, hours: 0 },
                    { week: 13, hours: 18 },
                    { week: 14, hours: 18 },
                    { week: 15, hours: 18 },
                ],
            },
            courseworkPrep: [
                {
                    deadline: 11,
                    weightage: 10,
                    studyHours: 10.8,
                    distribution: {
                        earlybird: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 10.8 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                        moderate: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 10.8 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                        procrastinator: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 10.8 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                    },
                },
                {
                    deadline: 7,
                    weightage: 30,
                    studyHours: 32.4,
                    distribution: {
                        earlybird: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 20 },
                            { week: 7, hours: 12.4 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                        moderate: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 16.2 },
                            { week: 7, hours: 16.2 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                        procrastinator: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 12.4 },
                            { week: 7, hours: 20 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                    },
                },
            ],
            classtestPrep: [
                {
                    deadline: 3,
                    weightage: 3.33,
                    studyHours: 3.6,
                    distribution: {
                        earlybird: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 3.6 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                        moderate: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 3.6 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                        procrastinator: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 3.6 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                    },
                },
                {
                    deadline: 5,
                    weightage: 3.33,
                    studyHours: 3.6,
                    distribution: {
                        earlybird: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 3.6 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                        moderate: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 3.6 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                        procrastinator: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 3.6 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 0 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                    },
                },
                {
                    deadline: 9,
                    weightage: 3.33,
                    studyHours: 3.6,
                    distribution: {
                        earlybird: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 3.6 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                        moderate: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 3.6 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                        procrastinator: [
                            { week: 1, hours: 0 },
                            { week: 2, hours: 0 },
                            { week: 3, hours: 0 },
                            { week: 4, hours: 0 },
                            { week: 5, hours: 0 },
                            { week: 6, hours: 0 },
                            { week: 7, hours: 0 },
                            { week: 8, hours: 0 },
                            { week: 9, hours: 3.6 },
                            { week: 10, hours: 0 },
                            { week: 11, hours: 0 },
                            { week: 12, hours: 0 },
                            { week: 13, hours: 0 },
                            { week: 14, hours: 0 },
                            { week: 15, hours: 0 },
                        ],
                    },
                },
            ],
        });

        const savedModule = await newModule.save();
        console.log("Module Saved");
        // res.status(201).json(savedModule);
    } catch (error) {
        console.log("Unable to save module data: ", error);
        // res.status(400).json({ message: error.message });
    }
};
// populateData();

module.exports = {
    fetchData,
    createModule,
    updateModule,
    fetchAllCodes,
};