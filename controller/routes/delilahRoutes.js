const express = require('express');
const router = express.Router();

router.get('/init', (req, res) => {
    res.send('Inside');
})

module.exports = router;