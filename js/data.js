/**
 * State Registry Mock Data - Odisha School Monitoring System (12 School Edition)
 */

const SCHOOL_NAMES = [
    "Capital High School, Unit-3",
    "BJEM School, Bhubaneswar",
    "DAV Public School, CSPur",
    "Ravenshaw Collegiate School",
    "SCB Medical Public School",
    "Sainik School, Bhubaneswar",
    "St. Joseph's High School",
    "Stewart School, Cuttack",
    "DMS, Bhubaneswar",
    "Kendriya Vidyalaya No. 1",
    "Loyola School, BBSR",
    "Saraswati Shishu Mandir"
];

const SCHOOLS_DATA = SCHOOL_NAMES.map((name, index) => {
    const id = `SCH${String(index + 1).padStart(3, '0')}`;
    return {
        id: id,
        name: name,
        address: index % 2 === 0 ? "Bhubaneswar, Odisha" : "Cuttack, Odisha",
        stats: { 
            totalStudents: 800 + Math.floor(Math.random() * 800), 
            totalTeachers: 35 + Math.floor(Math.random() * 25), 
            attendanceRate: 85 + Math.floor(Math.random() * 12), 
            mealConsumption: 90 + Math.floor(Math.random() * 9) 
        },
        teachers: [
            { id: `T${id}01`, name: "Mr. Ramesh Mohanty", subject: "Math", rating: 4.8, classes: "10th" },
            { id: `T${id}02`, name: "Mrs. Namita Dash", subject: "Physics", rating: 4.7, classes: "9th, 10th" },
            { id: `T${id}03`, name: "Mr. Biswajit Sahoo", subject: "English", rating: 4.5, classes: "All" },
            { id: `T${id}04`, name: "Ms. Pragyan Jena", subject: "Odia", rating: 4.9, classes: "8th, 9th" },
            { id: `T${id}05`, name: "Mr. Deepak Pattnaik", subject: "History", rating: 4.2, classes: "10th" },
            { id: `T${id}06`, name: "Mrs. Sunita Rout", subject: "Chemistry", rating: 4.6, classes: "9th" },
            { id: `T${id}07`, name: "Mr. Pratap Behera", subject: "Geography", rating: 4.3, classes: "8th" },
            { id: `T${id}08`, name: "Ms. Lopamudra Mishra", subject: "Biology", rating: 4.8, classes: "10th" },
            { id: `T${id}09`, name: "Mr. Ranjan Nayak", subject: "Civics", rating: 4.4, classes: "9th" },
            { id: `T${id}10`, name: "Mrs. Smruti Rath", subject: "Hindi", rating: 4.7, classes: "All" }
        ],
        facilities: { uniformProvided: true, booksProvided: true, midDayMeal: true, sportsEquip: true, libraryAccess: true, computerLab: true },
        sports: [
            { name: "Cricket", students: 120, level: "State" },
            { name: "Football", students: 80, level: "District" },
            { name: "Volleyball", students: 45, level: "Zonal" },
            { name: "Badminton", students: 30, level: "School" },
            { name: "Basketball", students: 40, level: "District" },
            { name: "Athletics", students: 60, level: "National" }
        ]
    };
});

const odishaFirstNames = ["Aarav", "Bibhu", "Lipika", "Rahul", "Swagat", "Pragyan", "Sneha", "Ananya", "Deepak", "Tanmay", "Smruti", "Biswajit", "Manorama", "Lopamudra", "Sudhanshu", "Ranjan", "Ashish", "Sunita", "Tushar", "Namita", "Pratap", "Rashmi", "Anita", "Bikram", "Sanjeev", "Gitanjali", "Kabita", "Ramesh", "Sasmita", "Alok", "Priyanka", "Suresh", "Vivaan", "Priya", "Amit", "Sonal", "Rajesh", "Meera", "Karan", "Ishani", "Arjun", "Kaveri", "Madhav", "Jyotirmayee", "Siddharth", "Preeti", "Gaurav", "Shubham", "Om", "Nisha"];
const odishaSurnames = ["Mohanty", "Dash", "Pattnaik", "Sahoo", "Jena", "Behera", "Mishra", "Nayak", "Rath", "Pradhan", "Panda", "Rout", "Tripathy", "Kar", "Samal", "Swain", "Muduli", "Parida", "Deo", "Sethy", "Lenka", "Biswal", "Barik", "Majhi", "Giri", "Dani", "Pal", "Tewari", "Mangaraj", "Hota"];

// Generate 120 Students (10 per school) for detailed tracking visibility
const STUDENTS_DATA = [];
for (let s = 0; s < SCHOOLS_DATA.length; s++) {
    const school = SCHOOLS_DATA[s];
    for (let i = 1; i <= 10; i++) {
        const fIdx = (s * 10 + i) % odishaFirstNames.length;
        const sIdx = (s * 10 + i) % odishaSurnames.length;
        const fName = odishaFirstNames[fIdx];
        const sName = odishaSurnames[sIdx];
        const studentId = `STU${school.id.slice(-3)}${String(i).padStart(2, '0')}`;
        
        STUDENTS_DATA.push({
            id: studentId,
            schoolId: school.id,
            name: `${fName} ${sName}`,
            class: (8 + (i % 3)) + ["A", "B", "C"][i % 3],
            photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fName}${sIdx}`,
            attendance: 75 + Math.floor(Math.random() * 25),
            performance: ["Excellent", "Good", "Average", "Outstanding"][Math.floor(Math.random() * 4)],
            meals: Array.from({length: 5}, (_, idx) => ({ 
                date: `2024-04-${15-idx}`, 
                status: ["Full Ration", "Full Ration", "Half Ration", "Absent"][Math.floor(Math.random() * 4)] 
            })),
            marks: [
                { subject: "Math", score: 65 + Math.floor(Math.random() * 35) },
                { subject: "Science", score: 65 + Math.floor(Math.random() * 35) },
                { subject: "English", score: 65 + Math.floor(Math.random() * 35) },
                { subject: "Odia", score: 65 + Math.floor(Math.random() * 35) }
            ],
            sports: { 
                name: ["Cricket", "Football", "Volleyball", "Badminton", "Basketball"][Math.floor(Math.random() * 5)], 
                level: ["District", "State", "Zonal"][Math.floor(Math.random() * 3)], 
                achievements: i % 4 === 0 ? "Tournament Winner" : "Active Player" 
            },
            hobbies: ["Photography", "Music", "Gardening", "Volunteering", "Sketches"].slice(0, 1 + Math.floor(Math.random() * 3))
        });
    }
}
