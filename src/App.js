import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  getTasks,
  postTask,
  updateTask,
  deleteTask,
} from "./utils/helpers/api";
import "bootstrap/dist/css/bootstrap.css";
import { convertDate } from "./utils/helpers/functions";

function App() {
  const [tasks, setTasks] = useState({});
  const [columns, setColumns] = useState({
    ["1"]: {
      name: "Pending",
      items: [],
    },
    ["2"]: {
      name: "Ongoing",
      items: [],
    },
    ["3"]: {
      name: "Completed",
      items: [],
    },
    ["4"]: {
      name: "In Development",
      items: [],
    },
    ["5"]: {
      name: "Status Card",
      items: [],
    },
  });
  const [addingCard, setAddingCard] = useState({});
  const [itemAdd, setItemAdd] = useState({});

  useEffect(() => {
    async function fetchData() {
      const res = await getTasks();
      const obj = {};
      const arr = [];
      res?.data.forEach((value) => {
        Object.assign(obj, {
          [value.columnId]: {
            name: value.status,
            items: res?.data.filter((val) => val.status == value.status),
          },
        });

        setColumns((prevState) => ({
          ...prevState,
          [value.columnId]: {
            name: value.status,
            items: res?.data.filter((val) => val.status == value.status),
          },
        }));
      });
    }
    fetchData();
  }, []);

  const onDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }

    await updateTask(result?.draggableId, {
      columnId: result?.destination?.droppableId,
      status: columns[result?.destination?.droppableId].name,
    });
  };

  const handleShowAddItem = (conlumnId) => {
    setAddingCard({
      ...addingCard,
      columns: conlumnId,
      isAdding: true,
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setItemAdd({
      ...itemAdd,
      [name]: value,
    });
  };

  const handleAddItem = async (columnId, columnName) => {
    const columnValue = [...columns[columnId].items];
    await postTask(
      { ...itemAdd, columnId: columnId.toString(), status: columnName },
      (res) => {
        columnValue.push(res);
        setColumns({
          ...columns,
          [columnId]: {
            ...columns[columnId],
            items: columnValue,
          },
        });
      }
    );
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: columnValue,
      },
    });
    setAddingCard({
      ...addingCard,
      columns: columnId,
      isAdding: false,
    });
  };

  const handleOnDelete = async (id, columnId) => {
    setColumns((prevState) => ({
      ...prevState,
      [columnId]: {
        ...prevState[columnId],
        items: columns[columnId].items.filter((val) => val.id !== id),
      },
    }));
    await deleteTask(id);
  };

  const handleColors = (column) => {
    switch (column) {
      case "1":
        return "#1C5A7C";
      case "2":
        return "#106354";
      case "3":
        return "#54117D";
      case "4":
        return "#71441B";
      case "5":
        return "#6E6D6D";
      default:
        break;
    }
  };

  return (
    <div
      className="container my-5"
      style={{ display: "flex", justifyContent: "center", height: "100%" }}
    >
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={columnId}
            >
              <div className="w-100">
                <h2
                  className="kanban-header px-2 m-0 fs-6 w-100 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: handleColors(columnId),
                  }}
                >
                  {column.name}
                </h2>
              </div>
              <div className="mx-2">
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "#E4E4E4",
                          padding: 4,
                          width: 250,
                          minHeight: 500,
                        }}
                        className="p-2"
                      >
                        {addingCard.columns == columnId &&
                        addingCard.isAdding ? (
                          <div className="d-flex flex-column p-3">
                            <div className="mb-2">
                              <input
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Title"
                                name="title"
                                onChange={handleOnChange}
                              />
                            </div>
                            <div className="mb-2">
                              <input
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Description"
                                name="description"
                                onChange={handleOnChange}
                              />
                            </div>
                            <div className="mb-2">
                              <input
                                className="form-control"
                                id="exampleFormControlInput1"
                                name="label"
                                placeholder="Label"
                                onChange={handleOnChange}
                              />
                            </div>
                            <div className="mb-2">
                              <input
                                className="form-control"
                                id="exampleFormControlInput1"
                                name="link"
                                placeholder="Link"
                                onChange={handleOnChange}
                              />
                            </div>
                            <button
                              className="btn btn-primary mb-1"
                              onClick={() =>
                                handleAddItem(columnId, column.name)
                              }
                            >
                              Add
                            </button>
                            <button
                              className="btn btn-danger mb-1"
                              onClick={() => setAddingCard(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="w-100 btn btn-primary mb-3"
                            onClick={() => handleShowAddItem(columnId)}
                          >
                            Add item
                          </button>
                        )}

                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    className="row"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className="col-sm-12">
                                      <div className="card">
                                        <div className="card-body">
                                          <h5 className="d-flex align-items-center justify-content-between mb-3">
                                            <span className="badge bg-success">
                                              {item.label}
                                            </span>
                                            <button
                                              onClick={() =>
                                                handleOnDelete(
                                                  item.id,
                                                  columnId
                                                )
                                              }
                                              type="button"
                                              className="btn-close mb-2"
                                              aria-label="Close"
                                            ></button>
                                          </h5>
                                          <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="card-title ">
                                              {item.title}
                                            </h5>
                                            <span>
                                              {convertDate(item.createdAt)}
                                            </span>
                                          </div>
                                          <span className="card-text">
                                            {item.description}
                                          </span>
                                          <br />
                                          <a href="#">{item.link}</a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  // <div
                                  //   ref={provided.innerRef}
                                  //   {...provided.draggableProps}
                                  //   {...provided.dragHandleProps}
                                  //   style={{
                                  //     userSelect: "none",
                                  //     padding: 16,
                                  //     margin: "0 0 8px 0",
                                  //     minHeight: "50px",
                                  //     backgroundColor: snapshot.isDragging
                                  //       ? "#263B4A"
                                  //       : "#456C86",
                                  //     color: "white",
                                  //     ...provided.draggableProps.style,
                                  //   }}
                                  // >
                                  //   <button
                                  //     onClick={() =>
                                  //       handleOnDelete(item.id, columnId)
                                  //     }
                                  //     type="button"
                                  //     className="btn-close"
                                  //     aria-label="Close"
                                  //   ></button>
                                  //   <div>
                                  //     <p>{item.title}</p>
                                  //     <p>{item.title}</p>
                                  //     <p>{item.title}</p>
                                  //     <p>{item.title}</p>
                                  //   </div>
                                  // </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
