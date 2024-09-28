import express, {Request, Response} from "express";
import mysql from "mysql2/promise";

const port = 3000

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const connection = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mudar123",
    database: "unicesumar"
});

app.set('view engine','ejs');
app.set('views',`${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async function (req: Request, res: Response){
    return res.render('main/index');
})

app.get('/users', async function (req: Request, res: Response) {
    const [rows] = await connection.query("SELECT * FROM users");
    return res.render('users/userslist', {
        users: rows
    });
});

app.get('/users/add', async function (req: Request, res: Response) {
    return res.render('users/userad');
});

app.post('/users', async function (req: Request, res: Response){
    const body = req.body;
    const insertQuery = "INSERT INTO users (nome,email,senha,papel,create_date,status) VALUES (?,?,?,?,?,?)"
    const status = body.checkStatus == 0 ? 'Inativo' : 'Ativo';

    const registerDate = new Date(Date.now());

    await connection.query(insertQuery,[body.nome,body.email,body.senha,body.usertype,registerDate.toLocaleString('pt-BR'),status]);
    res.redirect('/users');
});

app.post('/users/:id/delete', async function (req: Request, res: Response){
    const id = req.params.id;
    const sql = "DELETE FROM users WHERE id = ?"
    await connection.query(sql,[id]);
    res.redirect('/users');
});

app.get('/login', async function (req: Request, res: Response){
        return res.render('main/login');  
});

app.post('/login', async function(req: Request, res: Response){
    const body = req.body;
    const query = 'SELECT * FROM users WHERE email = ? and senha = ?'
    const [result] =  await connection.query(query,[body.email,body.senha]);
    if(result.length > 0){
        res.redirect('/users');
    } else {
        res.redirect('/login');
    }
});

app.listen(`${port}`, () => console.log(`Server is ready! Actual port: ${port}`));