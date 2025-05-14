import React, { useState, useEffect } from 'react';
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
  Grid,
  Button,
  FormControl,
  FormHelperText,
  Pagination, 
  TableContainer,
  Snackbar,
  Alert 
} from '@mui/material';
import { getFoods, createFood } from '../services/ApiService';
import { useForm } from 'react-hook-form';
import styles from './FoodPage.module.css';

interface FoodItem {
  id: number;
  name: string;
  calories: number;
  type: string;
}

function FoodPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [openAddFoodModal, setOpenAddFoodModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getFoods();
        if (response && response.data) {
          const foodData = Array.isArray(response.data) 
            ? response.data 
            : response.data.value || [];
          setFoods(foodData);
        }
      } catch (error) {
        console.error('Error fetching foods:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load food data',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FoodItem>();

  const handleAddFood = async (data: FoodItem) => {
    try {
      const response = await createFood(data);
      if (response) {
        setFoods(prevFoods => [response, ...prevFoods]); 
        reset();
        setOpenAddFoodModal(false);
        setSnackbar({
          open: true,
          message: 'Food item added successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error adding food:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add food item',
        severity: 'error'
      });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFoods = foods.slice(indexOfFirstItem, indexOfLastItem);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div className={styles.container}>
      <h1>Food List</h1>
      
      {isLoading ? (
        <p>Loading food data...</p>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={() => setOpenAddFoodModal(true)} 
                color="primary"
                sx={{ mb: 2 }}
              >
                Add Food
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              {foods.length === 0 ? (
                <Typography variant="body1">No food items found. Add one using the button above.</Typography>
              ) : (
                <>
                  <TableContainer sx={{ width: '80%' }}>
                    <Table className={styles.foodTable}>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Calories</TableCell>
                          <TableCell>Type</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentFoods.map((food) => (
                          <TableRow key={food.id}>
                            <TableCell>{food.id}</TableCell>
                            <TableCell>{food.name}</TableCell>
                            <TableCell>{food.calories}</TableCell>
                            <TableCell>{food.type}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {foods.length > itemsPerPage && (
                    <Pagination
                      count={Math.ceil(foods.length / itemsPerPage)}
                      page={currentPage}
                      onChange={handlePageChange}
                      sx={{ mt: 2 }}
                    />
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </>
      )}

      {}
      <Modal
        open={openAddFoodModal}
        onClose={() => setOpenAddFoodModal(false)}
        aria-labelledby="modal-title"
      >
        <Box sx={{ 
          width: { xs: '90%', sm: '70%', md: '50%' },
          bgcolor: 'background.paper', 
          p: 4,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Typography variant="h5" id="modal-title" sx={{ mb: 2 }}>
            Add New Food
          </Typography>
          <form onSubmit={handleSubmit(handleAddFood)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register('name', { required: 'Food name is required' })}
                  label="Food Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('calories', { 
                    required: 'Calories are required',
                    min: { value: 1, message: 'Calories must be positive' },
                    valueAsNumber: true
                  })}
                  label="Calories"
                  type="number"
                  fullWidth
                  error={!!errors.calories}
                  helperText={errors.calories?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('type', { required: 'Type is required' })}
                  label="Type"
                  fullWidth
                  error={!!errors.type}
                  helperText={errors.type?.message}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setOpenAddFoodModal(false)}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                >
                  Add Food
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default FoodPage;