import Skill from '../models/Skill.js'


// =================================
// ADD SKILL
// =================================

export const addSkill = async (req, res) => {

  try {

    const {
      name,
      category,
      type,
      description,
      level
    } = req.body


    if (!name || !category || !type) {

      return res.status(400).json({
        message: 'Name, category and type are required'
      })

    }


    const skill = await Skill.create({

      user: req.user.id,

      name,
      category,
      type,
      description: description || '',
      level: level || 'Beginner'

    })


    res.status(201).json({

      message: 'Skill added successfully',

      skill

    })


  } catch (error) {

    console.error(
      'Add skill error:',
      error
    )

    res.status(500).json({

      message: 'Server error'

    })

  }

}



// =================================
// GET MY SKILLS
// =================================

export const getMySkills = async (req, res) => {

  try {

    const skills = await Skill
      .find({
        user: req.user.id
      })
      .sort({
        createdAt: -1
      })


    res.status(200).json({

      message: 'Skills fetched successfully',

      skills

    })


  } catch (error) {

    console.error(
      'Get my skills error:',
      error
    )

    res.status(500).json({

      message: 'Server error'

    })

  }

}



// =================================
// GET ALL SKILLS
// =================================

export const getAllSkills = async (req, res) => {

  try {

    const skills = await Skill
      .find()
      .populate(
        'user',
        'name email role location'
      )
      .sort({
        createdAt: -1
      })


    res.status(200).json({

      message: 'All skills fetched successfully',

      skills

    })


  } catch (error) {

    console.error(
      'Get all skills error:',
      error
    )

    res.status(500).json({

      message: 'Server error'

    })

  }

}



// =================================
// UPDATE SKILL
// =================================

export const updateSkill = async (req, res) => {

  try {

    const {
      name,
      category,
      type,
      description,
      level
    } = req.body


    if (!name || !category || !type) {

      return res.status(400).json({
        message: 'Name, category and type are required'
      })

    }


    const skill = await Skill.findOne({

      _id: req.params.id,

      user: req.user.id

    })


    if (!skill) {

      return res.status(404).json({

        message:
          'Skill not found or you are not authorized'

      })

    }


    skill.name = name
    skill.category = category
    skill.type = type
    skill.description = description || ''
    skill.level = level || 'Beginner'


    await skill.save()


    res.status(200).json({

      message: 'Skill updated successfully',

      skill

    })


  } catch (error) {

    console.error(
      'Update skill error:',
      error
    )

    res.status(500).json({

      message: 'Server error'

    })

  }

}



// =================================
// DELETE SKILL
// =================================

export const deleteSkill = async (req, res) => {

  try {

    const skill = await Skill.findOne({

      _id: req.params.id,

      user: req.user.id

    })


    if (!skill) {

      return res.status(404).json({

        message:
          'Skill not found or you are not authorized'

      })

    }


    await Skill.findByIdAndDelete(
      req.params.id
    )


    res.status(200).json({

      message:
        'Skill deleted successfully'

    })


  } catch (error) {

    console.error(
      'Delete skill error:',
      error
    )

    res.status(500).json({

      message: 'Server error'

    })

  }

}