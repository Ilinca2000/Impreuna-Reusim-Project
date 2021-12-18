// Express Init
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Sequelize Init
const sequelize = require('./sequelize');

// Importing models
const Student = require('./models/student');
const Activity = require('./models/activity');
const Professor = require('./models/professor');
const Feedback = require('./models/feedback');
// const { noExtendRight } = require('sequelize/dist/lib/operators');

// Defining entities relationships
Professor.hasMany(Activity);
Activity.belongsToMany(Student, { through: 'enrollments' });
Student.belongsToMany(Activity, { through: 'enrollments' });
Activity.hasMany(Feedback);

// Express middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Kickstart the Express aplication
app.listen(port, () => {
  console.log(`The server is running on http://localhost: ${port}.`);
});

// Create a middleware to handle 500 status errors.
app.use((err, req, res, next) => {
  console.error('[ERROR]:' + err);
  res.status(500).json({ message: '500 - Server Error' });
});

/**
 * Create a special GET endpoint so that when it is called it will
 * sync our database with the models.
 */
app.get('/create', async (req, res, next) => {
  try {
    await sequelize.sync({ force: true });
    res.status(201).json({ message: 'Database created with the models.' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET all the students from the database.
 */
app.get('/students', async (req, res, next) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
});

/**
 * POST (add) a new student into the database.
 */
app.post('/students', async (req, res, next) => {
  try {
    const students = await Student.create(req.body);
    res
      .status(201)
      .json({ message: 'Student Added' })
      .location(students.id)
      .send();
  } catch (err) {
    next(err);
  }
});

/**
 * GET a student by id.
 */
app.get('/students/:studentId', async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId);
    if (student) {
      res.status(202).json(student);
    } else {
      res.sendStatus(404).json({ message: '404 - Student Not Found' });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * GET all the professors from the database.
 */
app.get('/professors', async (req, res, next) => {
  try {
    const professors = await Professor.findAll();
    res.status(200).json(professors);
  } catch (err) {
    next(err);
  }
});

/**
 * POST (add) a new professor into the database.
 */
app.post('/professors', async (req, res, next) => {
  try {
    const professors = await Professor.create(req.body);
    res
      .status(201)
      .json({ message: 'Professor Added' })
      .location(professors.id)
      .send();
  } catch (err) {
    next(err);
  }
});

/**
 * GET a professor by id.
 */
app.get('/professors/:professorId', async (req, res, next) => {
  try {
    const professor = await Professor.findByPk(req.params.professorId);
    if (professor) {
      res.status(202).json(professor);
    } else {
      res.sendStatus(404).json({ message: '404 - Professor Not Found' });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * POST a new activity.
 */
app.post('/professors/:professorId/activities', async (req, res, next) => {
  try {
    const professor = await Professor.findByPk(req.params.professorId);
    if (professor) {
      const activity = await Activity.create(req.body);
      professor.addActivity(activity);
      await professor.save();
      res.status(201).location(activity.id).send();
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});

/**
 * GET a professor's list of activities.
 */
app.get('/professors/:professorId/activities', async (req, res, next) => {
  try {
    const professor = await Professor.findByPk(req.params.professorId);
    if (professor) {
      const activities = await professor.getActivities();
      if (activities.length > 0) {
        res.json(activities);
      } else {
        res.sendStatus(204);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET an activity by id.
 */
app.get(
  '/professors/:professorId/activities/:activityId',
  async (req, res, next) => {
    try {
      const professor = await Professor.findByPk(req.params.professorId);
      if (professor) {
        const activities = await professor.getActivities({
          id: req.params.activityId,
        });
        const activity = activities.shift();
        if (activity) {
          res.json(activity);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET an activity by unique key. // not working properly, will respond 404
 */
app.get(
  '/professors/:professorId/activities/:activityKey',
  async (req, res, next) => {
    try {
      const professor = await Professor.findByPk(req.params.professorId);
      if (professor) {
        const activities = await professor.getActivities({
          id: req.params.activityKey,
        });
        const activity = activities.shift();
        if (activity) {
          res.json(activity);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT to update an activity.
 */
app.put(
  '/professors/:professorId/activities/:activityId',
  async (req, res, next) => {
    try {
      const professor = await Professor.findByPk(req.params.professorId);
      if (professor) {
        const activities = await professor.getActivities({
          id: req.params.activityId,
        });
        const activity = activities.shift();
        if (activity) {
          await activity.update(req.body);
          res.sendStatus(204);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE an activity.
 */
app.delete(
  '/professors/:professorId/activities/:activityId',
  async (req, res, next) => {
    try {
      const professor = await Professor.findByPk(req.params.professorId);
      if (professor) {
        const activities = await professor.getActivities({
          id: req.params.activityId,
        });
        const activity = activities.shift();
        if (activity) {
          await activity.destroy();
          res.sendStatus(204);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET an activity's list of enrollments.
 */
app.get(
  '/professors/:professorId/activities/:activityId/enrollments',
  async (req, res, next) => {
    try {
      const professor = await Professor.findByPk(req.params.professorId);
      if (professor) {
        const activities = await professor.getActivities({
          id: req.params.professorId,
        });
        const activity = activities.shift();
        if (activity) {
          const students = await activity.getStudents({ attributes: ['id'] });
          if (students.length > 0) {
            res.json(students);
          } else {
            res.sendStatus(204);
          }
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST (enroll) a student to an activity.
 */
app.post(
  '/professors/:professorId/activities/:activityId/enrollments/:studentId',
  async (req, res, next) => {
    try {
      const professor = await Professor.findByPk(req.params.professorId);
      if (professor) {
        const activities = await professor.getActivities({
          id: req.params.professorId,
        });
        const activity = activities.shift();
        const student = await Student.findByPk(req.params.studentId);
        if (activity && student) {
          activity.addStudent(student);
          await activity.save();
          res.sendStatus(204);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE a student from an activity enrollment.
 */
app.delete(
  '/professors/:professorId/activities/:activityId/enrollments/:studentId',
  async (req, res, next) => {
    try {
      const professor = await Professor.findByPk(req.params.professorId);
      if (professor) {
        const activities = await activity.getActivities({
          id: req.params.professorId,
        });
        const activity = activities.shift();
        const student = await Student.findByPk(req.params.studentId);
        if (activity && student) {
          activity.removeStudent(student);
          await activity.save();
          res.sendStatus(204);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET a student's list of activity enrollments
 */
app.get('/students/:studentId/enrollments', async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId);
    if (student) {
      const activities = await student.getActivities({
        attributes: ['id'],
      });
      if (activities.length > 0) {
        res.json(activities);
      } else {
        res.sendStatus(204);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET an activity's list of feedbacks
 */
app.get(
  '/professors/:professorId/activities/:activityId/feedbacks',
  async (req, res, next) => {
    try {
      const professor = await Professor.findByPk(req.params.professorId);
      if (professor) {
        const activities = await professor.getActivities({
          id: req.params.professorId,
        });
        const activity = activities.shift();
        if (activity) {
          const feedbacks = await activity.getFeedbacks();
          if (feedbacks.length > 0) {
            res.json(feedbacks);
          } else {
            res.sendStatus(204);
          }
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST a new feedback to one activity -> doar studentul va avea acces la aceasta functie de a lasa feedback, din frontend, iar id-ul lui nu va fi afisat (deci anonim).
 */
app.post(
  '/professors/:professorId/activities/:activityId/feedbacks/',
  async (req, res, next) => {
    try {
      const professor = await Professor.findByPk(req.params.professorId);
      if (professor) {
        const activities = await professor.getActivities({
          id: req.params.professorId,
        });
        const activity = activities.shift();
        if (activity) {
          const feedback = await Feedback.create(req.body);
          activity.addFeedback(feedback);
          await activity.save();
          res.status(201).location(feedback.id).send();
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET array of professors containing array of activities + enrollments of students
 */
app.get('/', async (req, res, next) => {
  try {
    const result = [];
    for (let u of await Professor.findAll()) {
      const professor = {
        id: u.id,
        username: u.username,
        fullName: u.fullName,
        activities: [],
        enrollements: [],
      };
      for (let c of await u.getActivities()) {
        professor.activities.push({
          id: c.id,
          name: c.name,
        });
        for (let s of await c.getStudents()) {
          professor.enrollements.push({
            activityId: c.id,
            studentId: s.id,
          });
        }
      }
      result.push(professor);
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
});
