import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import Draggable from './Draggable';

const HEIGHT = 80;

export const MyDraggableList = () => {
  const items = [11, 22, 33, 44, 55];
  const [state, setState] = useState({
    order: items,
    dragOrder: items, // items order while dragging
    draggedIndex: null
  });

  const handleDrag = useCallback(({translation, id}) => {
    const delta = Math.round(translation.y / HEIGHT);  // delta = [-1, 1]
    const index = state.order.indexOf(id);
    const dragOrder = state.order.filter(index => index !== id);

    // make sure in range
    if ((index + delta) < 0 || (index + delta) >= items.length) {
      return;
    }

    dragOrder.splice(index + delta, 0, id);

    setState(state => ({
      ...state,
      draggedIndex: id,
      dragOrder
    }));
  }, [state.order, items.length]);

  const handleDragEnd = useCallback(() => {
    setState(state => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null
    }));
  }, []);

  return (
    <div>
      <Container>
        {items.map(index => {
          const isDragging = state.draggedIndex === index;
          const top = state.dragOrder.indexOf(index) * (HEIGHT + 10);
          const draggedTop = state.order.indexOf(index) * (HEIGHT + 10);

          return (
            <Draggable
              key={index}
              id={index}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            >
              <Rect
                isDragging={isDragging}
                top={isDragging ? draggedTop : top}
              >
                {index}
              </Rect>
            </Draggable>
          );
        })}
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
`;

const Rect = styled.div.attrs(props => ({
  style: {
    transition: props.isDragging ? 'none' : 'all 500ms'
  }
}))`
  width: 300px;
  user-select: none;
  height: ${HEIGHT}px;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${({top}) => 100 + top}px;
  left: calc(50vw - 150px);
  font-size: 20px;
  color: #777;
`; 