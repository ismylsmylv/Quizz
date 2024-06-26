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
  help: string;
  prevHelp: string[];
  selectedPrevAnswer: object[];
}

const initialState: QuizState = {
  quiz: [],
  answers: [],
  selectedAnswer: {},
  help: "",
  prevHelp: [],
  selectedPrevAnswer: [],
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    selectAnswer: (state, action: PayloadAction<object>) => {
      const act = action.payload;
      state.answers = state.answers.filter((ans) => ans.id !== act.id);
      state.selectedAnswer = act;
    },
    addAnswer: (state, action) => {
      state.answers = [
        ...state.answers.filter(
          (answer) => answer?.id !== state.selectedAnswer.id
        ),
        state.selectedAnswer,
      ];
    },
    clearAnswers: (state) => {
      state.answers = [];
    },
    clearSelectAnswer: (state) => {
      state.selectedAnswer = [];
    },
    selectHelp: (state, action: PayloadAction<string>) => {
      state.help = action.payload;
    },
    selectedHelp: (state, action: PayloadAction<string>) => {
      state.help = "";
      state.prevHelp = [...state.prevHelp, action.payload];
    },
    clearHelp: (state) => {
      state.prevHelp = [];
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
export const {
  selectAnswer,
  addAnswer,
  clearAnswers,
  clearSelectAnswer,
  selectHelp,
  selectedHelp,
  clearHelp,
} = quizSlice.actions;

export default quizSlice.reducer;
