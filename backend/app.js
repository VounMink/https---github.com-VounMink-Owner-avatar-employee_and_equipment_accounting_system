const { Pool } = require('pg');
const express = require('express');
const BP = require('body-parser');
const path = require('node:path');

const app = express();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'prorotype_of_a_computer_accounting_system',
    password: 'LG_001',
    port: 5432
});

let jsonParser = BP.json();

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTOPNS, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

app.get('/staff', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM staff;');
        res.send(result.rows);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
app.post('/staff', jsonParser, async (req, res) => {
    const { FCs, office } = req.body;
    
    try {
        const result = await pool.query(`INSERT INTO staff (fcs, office) VALUES ('${FCs}', ${office});`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put('/staff', jsonParser, async (req, res) => {
    const { id, fcs, office } = req.body;
    try {
        const result = await pool.query(`UPDATE staff SET FCs = '${fcs}', office = ${office} WHERE id = ${id};`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/staff', jsonParser, async (req, res) => {
    const { id } = req.body;
    try {
        console.log(id);
        const result = await pool.query(`DELETE FROM staff WHERE id = ${id};`);
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/technic', async (req, res) => {
    try {
        const result = await pool.query('SELECT technic.id, technic.name, type_of_equipment.type FROM technic INNER JOIN type_of_equipment ON technic.type_of_equipment_id=type_of_equipment.id;');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/technic', jsonParser, async (req, res) => {
    const { name, type_of_equipment_id } = req.body;
    try {
        const result = await pool.query(`INSERT INTO technic (name, type_of_equipment_id) VALUES ('${name}', ${type_of_equipment_id});`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put('/technic', jsonParser, async (req, res) => {
    const { id, name, type_of_equipment_id } = req.body;
    try {
        const result = await pool.query(`UPDATE technic SET name = '${name}', type_of_equipment_id = ${type_of_equipment_id} WHERE id = ${id};`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/technic', jsonParser, async (req, res) => {
    const { id } = req.body;
    try {
        const result = await pool.query(`DELETE FROM technic WHERE id = ${id};`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/type_of_equipment', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM type_of_equipment;');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/type_of_equipment', jsonParser, async (req, res) => {
    const { type } = req.body;
    try {
        const result = await pool.query(`INSERT INTO type_of_equipment (type) VALUES ('${type}');`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put('/type_of_equipment', jsonParser, async (req, res) => {
    const { id, type } = req.body;
    try {
        const result = await pool.query(`UPDATE type_of_equipment SET type = '${type}' WHERE id = ${id};`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/type_of_equipment', jsonParser, async (req, res) => {
    const { id } = req.body;
    try {
        const result = await pool.query(`DELETE FROM type_of_equipment WHERE id = ${id};`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/employee_equipment', async (req, res) => {
    try {
        const result = await pool.query('SELECT employee_equipment.id, staff.fcs, staff.office, type_of_equipment.type, technic.name FROM employee_equipment, staff, technic, type_of_equipment WHERE employee_equipment.employee_id=staff.id AND employee_equipment.id_of_the_equipment=technic.id AND technic.type_of_equipment_id=type_of_equipment.id;');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/employee_equipment', jsonParser, async (req, res) => {
    const { employee_id, id_of_the_equipment } = req.body;
    try {
        const result = await pool.query(`INSERT INTO employee_equipment (employee_id,id_of_the_equipment) VALUES (${employee_id}, ${id_of_the_equipment});`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put('/employee_equipment', jsonParser, async (req, res) => {
    const { id, employee_id, id_of_the_equipment } = req.body;
    try {
        const result = await pool.query(`UPDATE employee_equipment SET employee_id = ${employee_id}, id_of_the_equipment = ${id_of_the_equipment} WHERE id = ${id};`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/employee_equipment', jsonParser, async (req, res) => {
    const { id } = req.body;
    try {
        const result = await pool.query(`DELETE FROM employee_equipment WHERE id = ${id};`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/invent', async (req, res) => {
    const { cabinet_number } = req.query
    
    try {
        const result = await pool.query(`SELECT staff.fcs, staff.id, type_of_equipment.type, technic.name, technic.id as tech_id FROM employee_equipment, staff, technic, type_of_equipment WHERE staff.office = ${cabinet_number} AND employee_equipment.employee_id=staff.id AND employee_equipment.id_of_the_equipment=technic.id AND technic.type_of_equipment_id=type_of_equipment.id;`);
        console.log(result.rows);
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/icons', jsonParser, (req, res) => {
    const { icon_name } = req.query;
    res.sendFile(`C:/ATNJSMYSQL/HelloApp/backend/assets/${icon_name}`);
});

app.get('/inventory', (req, res) => {
    res.sendFile('C:/ATNJSMYSQL/HelloApp/backend/page/inventory.html');
});

app.listen(3000, () => {
    console.log('Сервер успешно запущен!');
});