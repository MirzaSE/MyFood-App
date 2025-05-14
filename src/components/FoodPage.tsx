import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Pagination, TableContainer } from "@mui/material";
import { getFoods, createFood } from "../services/ApiService";
import { useForm } from "react-hook-form";
import styles from "./FoodPage.module.css";

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
  const [error, setError] = useState<string | null>(null);
  const [openAddFoodModal, setOpenAddFoodModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<FoodItem, "id">>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getFoods();
        setFoods(data);
      } catch (error) {
        console.error("Error fetching foods:", error);
        setError("Failed to load food data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFoods = foods.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddFood = async (data: Omit<FoodItem, "id">) => {
    try {
      const newFood = await createFood(data);
      setFoods([...foods, newFood]);
      reset();
      setOpenAddFoodModal(false);
    } catch (error) {
      console.error("Error adding food:", error);
      alert("Failed to add food item. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Food List</h1>
      {isLoading && <p>Loading food data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isLoading && !error && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => setOpenAddFoodModal(true)}
                color="primary"
              >
                Add Food
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TableContainer sx={{ width: "80%" }}>
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
            </Grid>
          </Grid>
          <Pagination
            count={Math.ceil(foods.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
          />

          <Modal
            open={openAddFoodModal}
            onClose={() => setOpenAddFoodModal(false)}
          >
            <Box
              sx={{
                width: "50%",
                mx: "auto",
                bgcolor: "background.paper",
                p: 4,
              }}
            >
              <Typography variant="h5">Add Food</Typography>
              <form onSubmit={handleSubmit(handleAddFood)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      {...register("name", { required: "Name is required" })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      label="Food Name"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("calories", {
                        required: "Calories are required",
                        min: { value: 1, message: "Must be positive" },
                      })}
                      error={!!errors.calories}
                      helperText={errors.calories?.message}
                      label="Calories"
                      type="number"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("type", { required: "Type is required" })}
                      error={!!errors.type}
                      helperText={errors.type?.message}
                      label="Type"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained">
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
