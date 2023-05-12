const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'containers-us-west-50.railway.app',
  database: 'railway',
  password: 'g8uLm1GGxweB7lUvsGOY',
  port: 7635,
});

app.use(express.json());
app.use(cors());

app.get('/peliculas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM peliculas');
    if(rows.length == 0){
      res.json({mensaje: 'No hay peliculas'})
    }
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las películas' });
  }
});

app.post('/peliculas', async (req, res) => {
  const { titulo, director, anio, descripcion, favorita } = req.body;

  try {
    const { rows } = await pool.query(
      'INSERT INTO peliculas (titulo, director, anio, descripcion, favorita) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titulo, director, anio, descripcion, favorita]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar la película' });
  }
});

app.get('/peliculas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM peliculas WHERE id = $1', [id]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Película no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la película' });
  }
});

app.put('/peliculas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, director, anio, descripcion, favorita } = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE peliculas SET titulo = $1, director = $2, anio = $3, descripcion = $4, favorita = $5 WHERE id = $6 RETURNING *',
      [titulo, director, anio, descripcion, favorita, id]
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Película no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la película' });
  }
});

app.delete('/peliculas/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const { rows } = await pool.query('DELETE FROM peliculas WHERE id = $1 RETURNING *', [id]);

      if (rows.length > 0) {
        res.json({ mensaje: 'Película eliminada correctamente' });
      } else {
        res.status(404).json({ error: 'Película no encontrada' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la película' });
    }
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
  });



