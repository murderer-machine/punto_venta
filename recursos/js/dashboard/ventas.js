import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Menu from '../menu/menu_horizontal'
import { Container, Row, Col, Card, Image, Modal } from 'react-bootstrap'
const Ventas = () => {
    return (
        <Menu modulo="ventas">
            <Container className="mt-2">
                <Row className="d-flex justify-content-center">
                    <Col xs={12} lg={12}>
                        <Card className="p-3">
                            hola soy venats react
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Menu>

    )
}
export default Ventas;
if (document.getElementById("ventas")) {
    ReactDOM.render(<Ventas />, document.getElementById("ventas"));
}