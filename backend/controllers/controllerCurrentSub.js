const { CurrentSub } = require('../database/database');

const getAllCurrentSubs = async (req, res) => {
  try {
    const currentSubs = await CurrentSub.findAll();
    res.status(200).json(currentSubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCurrentSub = async (req, res, internal = false) => {
  try {
    const { curs_userid, curs_subsid } = req.body;
    const currentSubData = {
      curs_userid,
      curs_subsid,
      curs_start: new Date(),  
      curs_end: null  
    };

    const currentSub = await CurrentSub.create(currentSubData);

    if (!internal) {
      res.status(201).json(currentSub);
    } else {
      return currentSub;
    }
  } catch (error) {
    if (!internal) {
      res.status(500).json({ error: error.message });
    } else {
      throw new Error(error.message);
    }
  }
};

module.exports = {
  getAllCurrentSubs,
  createCurrentSub,
};
