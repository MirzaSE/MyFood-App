import React, { useState, useEffect } from 'react'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  FormHelperText,
} from '@mui/material'
import { Grid } from '@mui/material'
import { Pagination, TableContainer } from '@mui/material'
import { getFoods, createFood } from '../services/ApiServices'
import { useForm } from 'react-hook-form'
import styles from './FoodPage.module.css'

interface FoodItem {
  id: number
  name: string
  calories: number
  type: string
}

function FoodPage() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [openAddFoodModal, setOpenAddFoodModal] = useState(false)
  const handleOpenAddFoodModal = () => setOpenAddFoodModal(true)
  const handleCloseAddFoodModal = () => setOpenAddFoodModal(false)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getFoods()  // <-- getFoods() returns { value, links }
        setFoods(data.value)           // <-- use data.value
      } catch (err) {
        console.error('Error fetching foods:', err)
        setError('Failed to load food data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handlePageChange = (_: any, newPage: number) => {
    setCurrentPage(newPage)
  }

  // Pagination slice
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentFoods = foods.slice(indexOfFirstItem, indexOfLastItem)

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FoodItem>({ mode: 'all' })

  // Add food
  const handleAddFood = async (data: FoodItem) => {
    if (!data.name || data.calories <= 0) {
      alert('Please enter a valid food name and calorie count.')
      return
    }
    try {
      const created = await createFood(data)
      setFoods(prev => [...prev, created])
      handleCloseAddFoodModal()
    } catch (err) {
      console.error('Error adding food:', err)
      alert('Failed to add food item. Please try again later.')
    }
  }

  return (
    <div>
      <h1>Food List</h1>
      {isLoading && <p>Loading food data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Button
                variant="contained"
                onClick={handleOpenAddFoodModal}
                color="primary"
                className="green-button"
              >
                Add Food
              </Button>
            </Grid>
            <Grid size={12}>
              <TableContainer sx={{ width: '80%' }}>
                <Table className={styles.foodTable}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Calories</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentFoods.map(food => (
                      <TableRow key={food.id}>
                        <TableCell>{food.id}</TableCell>
                        <TableCell>{food.name}</TableCell>
                        <TableCell>{food.calories}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Pagination
            count={Math.ceil(foods.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
          />

          <Modal
            open={openAddFoodModal}
            onClose={handleCloseAddFoodModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: '50%', bgcolor: 'background.paper', p: 4 }}>
              <Typography variant="h5" id="modal-title">
                Add Food
              </Typography>
              <form onSubmit={handleSubmit(handleAddFood)}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <TextField
                        {...register('name', {
                          required: 'Please enter a food name.',
                        })}
                        error={!!errors.name}
                        helperText={
                          errors.name
                            ? errors.name.message
                            : 'Please enter a food name.'
                        }
                        id="food-name"
                        label="Food Name"
                        variant="standard"
                      />
                    </FormControl>
                  </Grid>
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <TextField
                        {...register('calories', {
                          required: 'Please enter calories.',
                          validate: v =>
                            v > 0 || 'Calories must be positive.',
                        })}
                        error={!!errors.calories}
                        helperText={
                          errors.calories
                            ? errors.calories.message
                            : 'Please enter calories.'
                        }
                        id="calories"
                        label="Calories"
                        variant="standard"
                        type="number"
                      />
                    </FormControl>
                  </Grid>
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <TextField
                        {...register('type', {
                          required: 'Please enter a type.',
                        })}
                        error={!!errors.type}
                        helperText={
                          errors.type
                            ? errors.type.message
                            : 'Please enter a food type.'
                        }
                        id="type-name"
                        label="Type"
                        variant="standard"
                      />
                    </FormControl>
                  </Grid>
                  <Grid size={12}>
                    <Button variant="contained" type="submit">
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Modal>
        </>
      )}
    </div>
  )
}

export default FoodPage
