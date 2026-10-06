import express from 'express'

import {

  addSkill,

  getMySkills,

  getAllSkills,

  updateSkill,

  deleteSkill

} from '../controllers/skillController.js'

import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()


// =================================
// ADD SKILL
// =================================

router.post(

  '/',

  authMiddleware,

  addSkill

)


// =================================
// GET MY SKILLS
// =================================

router.get(

  '/my-skills',

  authMiddleware,

  getMySkills

)


// =================================
// GET ALL SKILLS
// =================================

router.get(

  '/',

  authMiddleware,

  getAllSkills

)


// =================================
// UPDATE SKILL
// =================================

router.put(

  '/:id',

  authMiddleware,

  updateSkill

)


// =================================
// DELETE SKILL
// =================================

router.delete(

  '/:id',

  authMiddleware,

  deleteSkill

)


export default router