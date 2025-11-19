const express = require('express');
const router = express.Router();

// GET /applicants
// Returns list of applications joined with user info
router.get('/', async (req, res) => {
  try {
    const sql = `SELECT a.id AS application_id, a.user_id, a.job_id, a.applied_at, a.status, a.resume_link,
                 u.u_Fname, u.u_Lname, u.u_kana, u.u_nick, u.Birthday, u.Gender, u.u_Contact, u.u_Address, u.u_Email, u.Employment
                 FROM Applications a
                 JOIN User u ON u.id = a.user_id
                 ORDER BY a.applied_at DESC`;
    const [rows] = await global.db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /applicants error', err);
    res.status(500).json({ success: false, message: 'サーバーエラー' });
  }
});

// POST /applicants
// Create new application record. Body: { user_id, job_id, resume_link (optional), status (optional) }
router.post('/', async (req, res) => {
  try {
    const { user_id, job_id, resume_link, status } = req.body;
    if (!user_id) return res.status(400).json({ success: false, message: 'user_id is required' });
    const [result] = await global.db.query(
      'INSERT INTO Applications (user_id, job_id, resume_link, status) VALUES (?, ?, ?, ?)',
      [user_id, job_id || null, resume_link || null, status || '新規']
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('POST /applicants error', err);
    res.status(500).json({ success: false, message: 'サーバーエラー' });
  }
});

// PATCH /applicants/:id
// Update status (or other fields) of an application
router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'status is required' });
    const [result] = await global.db.query('UPDATE Applications SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'not found' });
    res.json({ success: true, message: 'status updated' });
  } catch (err) {
    console.error('PATCH /applicants/:id error', err);
    res.status(500).json({ success: false, message: 'サーバーエラー' });
  }
});

module.exports = router;
