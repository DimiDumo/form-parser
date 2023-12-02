import { generateFormJson, getFormBuilderData } from './src/form-builder';
import express, { Request, Response } from 'express';
import cors from 'cors';
const port = 3001;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', async (req: Request, res: Response) => {
  try {
    const data = await getFormBuilderData();
    console.log('data: ', data);
    console.log('data: ', typeof data[0].type);
    const formData = generateFormJson(data);
    console.log('formData: ', JSON.stringify(formData, null, 2));

    res.json(formData);
  } catch (err) {
    console.error('err getting form data: ', err);
    res.status(500).send('Error getting form data');
  }
});

app.listen(port, () => {
  console.log(`Serving form data on port ${port}`);
});

async function main() {
  try {
    const data = await getFormBuilderData();
    console.log('data: ', data);
    console.log('data: ', typeof data[0].type);
    const formData = generateFormJson(data);
    console.log('formData: ', JSON.stringify(formData, null, 2));
  } catch (err) {
    console.error('err: ', err);
  }
}

main();
