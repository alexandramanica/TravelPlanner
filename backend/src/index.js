const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./config/logger.js');

const userRouter = require('./routes/userRouter.js');
const authRouter = require('./routes/authRouter.js');
const atractionRouter = require('./routes/attractionsRouter.js')
const activityRouter = require('./routes/activitiesRouter.js');
const restaurantRouter = require('./routes/restaurantRouter.js');

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/attraction", atractionRouter)
app.use("/api/activity", activityRouter);
app.use("/api/restaurant", restaurantRouter);

const port = process.env.PORT || 8001;
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

module.exports = app;
