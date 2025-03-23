import { createSlice } from "@reduxjs/toolkit";
import { uniqueId } from "lodash";

const initialState = {
  blocks: [
    {
      id: "default-block",
      type: "title",
      content: {
        title: "Добро пожаловать в конструктор блоков!",
        image:
          "https://cdn.tbank.ru/static/pages/files/67fdf053-90ea-4ffc-8da0-f58726560f50.png",
      },
    },
    {
      id: "default-blodfgghdfsgdfck",
      type: "test",
      content: {
        question: "Добро пожаловать в конструктор блоков??????",
        options: [
          {
            text: 'Option 1',
            key: '1',
            isCorrect: false,
            color: '#fff'
          },
          {
            text: 'Option 9991',
            key: '2',
            isCorrect: false,
            color: '#fff'
          },
          {
            text: 'Option 8',
            key: '122',
            isCorrect: true,
            color: 'green'
          }
        ]
      },
    },
  ], 
};

const TITLE = 'title'
const TEXT = 'text'
const TEST = 'test'

const getId = () => {
  return uniqueId('__block__')
}

const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    addBlock: (state, action) => {
      switch (action.payload.type) {
        case TITLE: {
          const value = {
            id: getId(),
            type: TITLE,
            content: {
              title: "Заголовок! " + ++state.blocks.filter(block => block.type === TITLE).length,
              image:
                "https://cdn.tbank.ru/static/pages/files/67fdf053-90ea-4ffc-8da0-f58726560f50.png",
            },
          }

          state.blocks.push( value )
        
        }
          break;
        case TEXT: 
          const value = {
            id: getId(),
            type: TEXT,
            content: {
              text: "Параграф " + ++state.blocks.filter(block => block.type === TEXT).length,
            },
          }

          state.blocks.push(value)
          // Почитать почему нельзя использовать индексы массива для списка в компонентах
        break;
        case TEST: {
          const value = {
            id: getId(),
            type: TEST,
            content: {
              question: 'Вопрос ' + ++state.blocks.filter(block => block.type === TEST).length, // question 1
              options: [
                {
                  text: 'Option 1',
                  key: getId(),
                  isCorrect: true,
                  color: '#fff'
                  
                },
                {
                  text: 'Option 1',
                  key: getId(),
                  isCorrect: false,
                  color: '#fff'
                  
                },
                {
                  text: 'Option 1',
                  key: getId(),
                  isCorrect: false,
                  color: '#fff'
                  
                }
              ]
            }
          }

          state.blocks.push(value)
        }
        
        break;
      
      }

      
    },
    updateBlock: (state, action) => {
      // TODO: Реализовать обновление блока
      switch (action.payload.block.type) {
        case TITLE: {
        const findBlock = state.blocks.find(block => block.id === action.payload.block.id)

        if(findBlock) {
          findBlock.content.title = action.payload.formData.title
          findBlock.content.image = action.payload.formData.image
        }
     
        }
          break;
        case TEXT: {

          const findBlock = state.blocks.find(block => block.id === action.payload.block.id)

          if(findBlock) {
            findBlock.content.text = action.payload.formData.text
          }
        }
        break;
        case TEST: {
          const findBlock = state.blocks.find(block => block.id === action.payload.block.id)

          if(findBlock) {
            findBlock.content = action.payload.formData 
          }
        }
        break;
      
      }
    },

    removeBlock: (state, action) => {
      // TODO: Реализовать удаление блока
      state.blocks = state.blocks.filter(block => block.id !== action.payload);
    },
    clearBlocks: (state) => {
      // TODO: Реализовать очистку всех блоков
      state.blocks = [];
    },
    moveBlock: (state, action) => {
      // TODO: Реализовать перемещение блока (drag-n-drop)
    },
    moveBlockUp: (state, action) => {
      // TODO: Реализовать перемещение блока вверх
    },
    moveBlockDown: (state, action) => {
      // TODO: Реализовать перемещение блока вниз
    },
  },
});

export const {
  addBlock,
  updateBlock,
  removeBlock,
  clearBlocks,
  moveBlock,
  moveBlockUp,
  moveBlockDown,
} = blocksSlice.actions;

export default blocksSlice.reducer;
