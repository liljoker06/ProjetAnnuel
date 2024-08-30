const { User } = require ('../../database/database');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error){
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllUsers,
};