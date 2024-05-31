import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchQuiz = createAsyncThunk("users/fetchByIdStatus", async () => {
  const response = await axios("http://localhost:3000/quiz");
  return response.data;
});

export interface QuizState {
  quiz: object[];
  answers: object[];
  selectedAnswer: object;
}

const initialState: QuizState = {
  quiz: [],
  answers: [],
  selectedAnswer: {},
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    selectAnswer: (state, action: PayloadAction<object>) => {
      state.selectedAnswer = action.payload;
    },
    addAnswer: (state) => {
      state.answers = [...state.answers, state.selectedAnswer];
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchQuiz.fulfilled, (state, action) => {
      // Add user to the state array

      state.quiz = action.payload;
      // console.table(state.quiz);
    });
  },
});

// Action creators are generated for each case reducer function
export const { selectAnswer, addAnswer } = quizSlice.actions;

export default quizSlice.reducer;
