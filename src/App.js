import React, { useEffect, useState } from "react";
import { firebase } from "./firebase";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  Drawer,
  Spin,
  message,
  Empty,
} from "antd";
import "./App.css";
import "antd/dist/antd.css";

function App() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const showDrawer = () => {
    setVisible(true);
    setEdit(false);
    setNombre("");
    setId("");
    setEmail("");
  };
  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const db = firebase.firestore();
    try {
      const data = await db.collection("users").get();
      const arrayData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(arrayData);
      setLoading(false);
    } catch (error) {}
  };

  const addUser = async () => {
    if (!nombre.trim() || !email.trim()) {
      message.warning("El nombre y el email son requeridos");
      return;
    }
    try {
      const db = firebase.firestore();
      const newUser = {
        email: email,
        nombre: nombre,
      };
      const data = await db.collection("users").add({
        email: email,
        nombre: nombre,
      });
      setUsers([...users, { id: data.id, ...newUser }]);
      setNombre("");
      setEmail("");
      setVisible(false);
      message.success("Se ha agregado correctamente el usuario", 5);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("users").doc(id).delete();
      getData();
      message.success("Se ha borrado el usuario", 5);
    } catch (error) {}
  };

  const activeUpdate = (item) => {
    setEdit(true);
    setNombre(item.nombre);
    setEmail(item.email);
    setId(item.id);
    setVisible(true);
  };

  const updateUser = async () => {
    try {
      const db = firebase.firestore();
      await db.collection("users").doc(id).update({
        email: email,
        nombre: nombre,
      });
      message.success("Se ha actualizado correctamente el usuario", 5);
      setEdit(false);
      setNombre("");
      setId("");
      setEmail("");
      setVisible(false);
      getData();
    } catch (error) {}
  };

  const drawer = (
    <Drawer
      title={edit ? "Editar Usuario" : "Agregar Usuario"}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      <Form onFinish={edit ? updateUser : addUser}>
        <div style={{ marginBottom: 16 }}>
          <Input
            type="text"
            placeholder="Ingrese nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Input
            type="text"
            placeholder="Ingrese Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="primary" htmlType="submit">
          {edit ? "Editar" : "Agregar"}
        </Button>
      </Form>
    </Drawer>
  );
  return (
    <div className="container-layout">
      {drawer}
      <div
        className="top-header"
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        <h3>Lista de Usuarios</h3>
        <Button onClick={showDrawer}>Agregar usuario</Button>
      </div>
      {users.length === 0 ? (
        <Empty />
      ) : (
        <Row>
          {users.map((item) => (
            <Col sm={12} lg={8} xs={24} key={item.id}>
              <Card key={item.id}>
                <p>{item.nombre}</p>
                <p>{item.email}</p>
                <Button onClick={() => activeUpdate(item)}>Editar</Button>
                <Button
                  onClick={() => deleteUser(item.id)}
                  type="primary"
                  danger
                >
                  Eliminar
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <div style={{ margin: "25px" }}>{loading ? <Spin /> : ""}</div>
    </div>
  );
}

export default App;
