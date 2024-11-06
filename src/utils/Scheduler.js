import { CronJob } from 'cron';
import { categorizeAndSave } from './CategorizeAndSave.js';

export const job = new CronJob('0 0 * * *', async function () {
    console.log('Running categorizeAndSave...');
    await categorizeAndSave(process.env.appId, process.env.noOfReviews);
});

/*
* * * * *
| | | | |
| | | | +---- Day of the week (0 - 7) (Sunday to Saturday, 7 is also Sunday)
| | | +------ Month (1 - 12)
| | +-------- Day of the month (1 - 31)
| +---------- Hour (0 - 23)
+------------ Minute (0 - 59)
*/