import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import fs from "fs";
import * as cheerio from "cheerio";

const app = express();
const port = process.env.PORT || 3000;
let noOfFile = 1;
let arrayOfFiles = [];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res) => {
    res.render("index.ejs",{files:arrayOfFiles});
});

app.get("/home",(req,res) => {
    res.render("index.ejs");
});

app.get("/create",(req,res) => {
    res.render("create.ejs");
});


app.post("/submit",(req,res) => {
    let fileName = req.body["title"];
    let safeName = fileName.replace(/ /g,"_");
    const content = "<%- include(\""+"partials/header.ejs\""+") %>"+ "<div class=\""+"form\"><div style=\"height:100vh; background-color: #D9D1C760; width:100vh; margin: 50px; overflow: scroll;\"><p style=\"text-align: justify; margin: 50px; color: #730202\">"+req.body["Blog"]+"</p></div></div>" +"<%- include(\""+"partials/footer.ejs\""+") %>";
    fs.writeFile("views/"+safeName+".ejs",content,(err) => {
       if (err) throw err;
       console.log('The file has been saved!');
       arrayOfFiles.push(safeName);
       app.get("/"+safeName, (req,res) => {
        res.render(safeName+".ejs");
       });

    
    app.get("/search_update/"+safeName, (req,res) =>{
        const toBeContent = fs.readFileSync("views/"+safeName+".ejs","utf-8");
        const $ = cheerio.load(toBeContent);
        const result = $("p").text();
        const fileN = safeName.replace(/_/g," ");
        res.render("update_page.ejs",{pretext:result, title_t:fileN, fName:safeName});
    });
        
    app.post("/search_update/"+safeName, (req,res) =>{
        const toBeContent = fs.readFileSync("views/"+safeName+".ejs","utf-8");
        const $ = cheerio.load(toBeContent);
        const result = $("p").text();
        const fileN = safeName.replace(/_/g," ");
        res.render("update_page.ejs",{pretext:result, title_t:fileN, fName:safeName});
    });

    app.post("/submit_update", (req,res) => {
        const safeName = req.body["fileN"];

        const updated_content = "<%- include(\""+"partials/header.ejs\""+") %>"+ "<div class=\""+"form\"><div style=\"height:100vh; background-color: #D9D1C760; width:100vh; margin: 50px; overflow: scroll;\"><p style=\"text-align: justify; margin: 50px; color: #730202\">"+req.body["blog"]+"</p></div></div>" +"<%- include(\""+"partials/footer.ejs\""+") %>";
        fs.writeFileSync("views/"+safeName+".ejs",updated_content,(err) => {
            if (err) throw err;
            console.log('The file has been updated');
        });
        res.render("submitted.ejs");
    });
    });
    app.get("/delete_post/" +safeName, (req,res) => {
        const fileD = safeName.replace(/_/g," ");
        res.render("sure.ejs",{title_d:fileD,fName:safeName});
        
    });
    app.post("/delete_post/"+safeName, (req,res) => {
        const fileD = safeName.replace(/_/g," ");
        res.render("sure.ejs",{title_d:fileD,fName:safeName})
    });
    app.post("/deleted/"+safeName, (req,res) => {
        const fileD = safeName.replace(/_/g," ");
        arrayOfFiles = arrayOfFiles.filter(item => item !== safeName);
        
        fs.unlink("views/"+safeName+".ejs", (err) => {
            if (err) {
                console.error("Failed to delete file:", err);
            }
        });
        console.log("deleted");
        res.render("deleted.ejs",{title_delete:fileD, fiName : safeName});
    });
    noOfFile++;
    
    
    
    
    
    res.render("submitted.ejs");
});

app.get("/view", (req,res) => {
    res.render("view.ejs",{files : arrayOfFiles});
})

app.post("/search", (req,res) => {
    const fileToOpen = req.body["Searched"].replace(/ /g,"_")+".ejs";
    res.render(fileToOpen);
})

app.get("/update",(req,res) => {
    res.render("update.ejs", {files: arrayOfFiles});
});

app.post("/search_update/intermediate", (req,res) => {
    const searchedFile = req.body["Searched"].replace(/ /g,"_");
    res.redirect("/search_update/"+searchedFile);
});

app.post("/delete_post/intermediate", (req,res) => {
    const deleteFile = req.body["Searched"].replace(/ /g,"_");
    res.redirect("/delete_post/"+deleteFile);
});

app.get("/delete",(req,res) => {
    res.render("delete.ejs", {files: arrayOfFiles});
});

app.post("/delete",(req,res) => {
    res.render("delete.ejs", {files: arrayOfFiles});
});

app.get("/about", (req,res) => {
    res.render("about.ejs");
});

app.get("/contact", (req,res) => {
    res.render("contact.ejs");
});

app.get("/donate", (req,res) => {
    res.render("donate.ejs");
});

app.listen(port, () => {
    console.log(`Started listening at port: ${port}`);
});


