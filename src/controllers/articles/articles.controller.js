import { Articles } from "../../models";
 
export const createArticle = async (req, res) => {
  const { title, description } = req.body;
  const image = req.file.path;
  
  try {
    const newArticle = new Articles({ title, description, image });
    await newArticle.save();
    res.json(newArticle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getArticles = async (req, res) => {
  try {
    const articles = await Articles.find();
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
