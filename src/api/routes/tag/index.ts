import { NameBody } from '@/types'
import express, { Request, Response } from 'express'
import { addPerson, findPersonByName, getAllPeople } from './person'

const router = express.Router()

// Get all people
router.get('/person/get', async (req: Request, res: Response) => {
  try {
    const people = await getAllPeople()

    res.status(200).json(people.rows)
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error getting people.')
    return
  }
})

// Add a person
router.post('/person/add', async (req: Request, res: Response) => {
  const { name }: NameBody = req.body

  if (!name || name.length === 0) {
    res.status(422).json('No name provided.')
    return
  }

  try {
    const people = await findPersonByName(name)

    if (people.rowCount !== 0) {
      res.status(409).json('Person exists already.')
      return
    }

    await addPerson(name)

    res.status(200).json('Person added successfully.')
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error adding person.')
    return
  }
})
