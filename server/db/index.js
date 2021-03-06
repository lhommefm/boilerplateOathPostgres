const { Pool } = require('pg');
const chalk = require('chalk');

const db = new Pool({
  // uri: "",
  user: process.env.DATABASE_USER,
  // password: '',
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DATABASE,
  port: process.env.DATABASE_PORT,
});

// for a Facebook or Google login, look up their info via email and updated Partner Id if missing
const partnerLogin = async (email, firstName, lastName, partner, partnerId) => {
  try{ 
    console.log(chalk.blue('partnerLogin triggered'));
    const res = await db.query(`
      SELECT user_id, first_name, last_name, facebook, google 
      FROM users 
      WHERE email = '${email}'
    `); 
    console.log(chalk.blue('partnerLogin ==> ', 'results', JSON.stringify(res.rows[0])));
    if (!res.rows[0]) {
      const res2 = addPartnerUser(email, firstName, lastName, partner, partnerId);
      console.log(chalk.blue('partnerLogin ==> addPartnerUser triggered'));
      return(res2);
    }
    if (!res.rows[0][partner]) {
      const res3 = addPartnerIdToEmail(email, partner, partnerId)
      console.log(chalk.blue('partnerLogin ==> addPartnerIdToEmail triggered'));
      return(res3);
    }
    return(res.rows[0]);
  } catch (error) {
    console.log(chalk.red('partnerLogin error ==>', error));
  }
}


// update Facebook or Google ID by email
const addPartnerIdToEmail = async (email, partner, partnerId) => {
  try {
    const res = await db.query(`
      UPDATE users
      SET ${partner} = '${partnerId}'  
      WHERE email = '${email}'
      RETURNING user_id, first_name, last_name
    `);
    console.log(chalk.blue('addPartnerIdToEmail ==> rowCount', JSON.stringify(res.rows[0])));
    return(res.rows[0]);
  } catch (error) {
    console.log(chalk.red('addPartnerIdToEmail error ==>', error));
  } 
}

// add a new Google or Facebook user to the database
const addPartnerUser = async (email, firstName, lastName, partner, partnerId) => {
  try {
    const res = await db.query(`
      INSERT INTO users (email, first_name, last_name, ${partner}) 
      VALUES ('${email}', '${firstName}', '${lastName}', '${partnerId}')
      RETURNING user_id, first_name, last_name
    `); 
    console.log(chalk.blue('addPartnerUser ==> ', JSON.stringify(res.rows[0])));
    return(res.rows[0]);
  } catch (error) {
    console.log(chalk.red('addPartnerUser error ==>', error));
  }    
}

// deserialize user
const deserializeUser = async (user_Id) => {
  console.log(chalk.blue('deserialize userId ==>',user_Id));
  try {
    const res = await db.query(`
      SELECT user_id, first_name, last_name 
      FROM users 
      WHERE user_id = '${user_Id}'
    `); 
    // console.log(chalk.blue('deserializeUser ==> ', JSON.stringify(res.rows[0])));  
    return(res.rows[0])
  } catch (error) {
    console.log(chalk.red('deserializeUser error ==>', error));
  }
}

module.exports = {
  db,
  partnerLogin,
  deserializeUser
};