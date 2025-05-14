import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Modal, Box,
  TextField,
  Typography, 
  Grid,
  Button,
  FormControl,
  FormHelperText,
   } from '@mui/material';
import { Pagination, TableContainer  } from '@mui/material';
import { getFoods, createFood } from '../services/ApiService'; // Assuming ApiService is in services folder
import { useForm } from 'react-hook-form'; // Form validation library
import styles from './FoodPage.module.css'


interface FoodItem {
  id: number;
  name: string;
  calories: number;
  type: string
}

function FoodPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState<string | null>(null); 

    // Modal state and handlers
    const [openAddFoodModal, setOpenAddFoodModal] = useState(false);
    const handleOpenAddFoodModal = () => setOpenAddFoodModal(true);
    const handleCloseAddFoodModal = () => setOpenAddFoodModal(false);
  
    // New food data state
    const [newFoodName, setNewFoodName] = useState('');
    const [newFoodCalories, setNewFoodCalories] = useState(0);
  // Fetch data from ApiService on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state to true
      setError(null); // Clear any previous errors

      try {
        const response = await getFoods();
        setFoods(response.data.value);
      } catch (error) {
        console.error('Error fetching foods:', error); // Log the error for debugging
        setError('Failed to load food data. Please try again later.');
      } finally {
        setIsLoading(false); // Set loading state to false after fetching or error
      }
    };
    fetchData();
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
 };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFoods = foods.slice(indexOfFirstItem, indexOfLastItem);

    // Form validation with React Hook Form
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FoodItem>({ mode: 'all' }); // Validate all fields on submit
  
    // Handle adding a new food item
    const handleAddFood = async (data : FoodItem) => {
      console.log(`Submitted`);
      if (!data.name || data.calories <= 0) {
        console.log(data.name)
        alert('Please enter a valid food name and calorie count.');
        return;
      }
      
      // Implement logic to send newFood data to your API for creation
      // (replace with your actual API call)
      try {
        const response = await createFood(data);
        console.log(response)
        setFoods([...foods, response]); // Update local state
        setNewFoodName('');
        setNewFoodCalories(0);
        handleCloseAddFoodModal();
      } catch (error) {
        console.error('Error adding food:', error);
        alert('Failed to add food item. Please try again later.');
      }
    };

    

  return (
    <div>
      <h1>Food List</h1>
      {isLoading && <p>Loading food data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <>
        <Grid container spacing={2}> {/* Adjust spacing value as needed */}
  <Grid item xs={12}>
        <Button variant="contained" onClick={handleOpenAddFoodModal} color="primary" className="green-button">
            Add Food
          </Button>
          <br></br>
          </Grid>
  <Grid item xs={12}>
          <TableContainer  sx={{ width: '80%' }}> {/* Wrap the Table component */}
          <Table className={styles.foodTable}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Calories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentFoods.map((food) => (
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
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Centering styles

      >
        <Box sx={{ width: '50%', mx: 'auto', bgcolor: 'background.paper', p: 4 }}>
          <Typography variant="h5" id="modal-title">
            Add Food
          </Typography>
          <form onSubmit={handleSubmit(handleAddFood)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    {...register('name', { required: 'Please enter a food name.' })}
                    error={!!errors.name} // Set error state based on validation
                    helperText={errors?.name ? errors?.name?.message?.toString() : 'Please enter a food name.'} 
                    id="food-name"
                    label="Food Name"
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>                  
                  <TextField
                    {...register('calories', {
                      required: 'Please enter calories.',
                      validate: (value) => value > 0 || 'Calories must be positive.',
                    })}
                    error={!!errors.calories} // Set error state based on validation
                    helperText={errors?.calories ? errors?.calories?.message?.toString() : 'Please enter calories.'} 
                    id="calories"
                    label="Calories"
                    variant="standard"
                    type="number"
                  />
                  <FormHelperText sx={{ color: 'red' }}>
                   
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    {...register('type', { required: 'Please enter a type.' })}
                    error={!!errors.name} // Set error state based on validation
                    helperText={errors?.name ? errors?.name?.message?.toString() : 'Please enter a food type.'} 
                    id="type-name"
                    label="Type"
                    variant="standard"
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
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
  );
}

export default FoodPage;
