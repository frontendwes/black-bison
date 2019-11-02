const express = require('express')
const router = express.Router()
const database = require("../database/connection.js")
const expressJwt = require('express-jwt')
const jwtMiddleWare = expressJwt({secret: 'dragonball'})
//===================================MOSTRA ITENS PELO ID DA CATEGORIA SELECIONADA============================

router.get('/:id', async (request, response) => { 

    const IDcategory = request.params.id

    if (IDcategory && IDcategory !== 0 )
    {
            const itensCategory = 'SELECT * FROM item WHERE item_category = ?'

           const rows = await database.all( itensCategory, [IDcategory]) 
        
                if (rows == undefined){
                    response.status(404).send({ sucess: false, error: 'Categoria inexistente!' })
                }
                    response.status(200).json({sucess: rows, error: false})  
 
    }else
        response.status(404).send({sucess: false, error: "erro!"})            
})

//===========================================CADASTRA CATEGORIA===============================================

router.post('/',(request, response) => {

    const categoryName = request.body.categoryName;

    if(categoryName)
    {
        database.serialize(() => {

            const insertCategory = 'INSERT INTO category (category_name) VALUES (?)'

            database.run(insertCategory, [categoryName], (error) => {
                if(error)
                    response.status(404).json({sucess: false, error: error.message})
            else
                response.status(200).json({sucess: "Categoria inserida com sucesso!", error: false})
            
            })     
        })
    }
})

//=======================================DELETA CATEGORIA PELO ID=============================================

router.delete('/:id', (request, response) => {

    const categoryID = request.params.id
    
    if(categoryID){

        database.serialize(() =>{

            const deleteCategory = 'DELETE FROM category WHERE category_id = ?'

            database.run(deleteCategory, categoryID, (error) => {

                if(error){
                    response.status(404).json({sucess: false, error: error.message})
                }else{
                    response.status(200).json({sucess: "Categoria deletada com sucesso!", error: false})
                }
            })
        })  
    }
})

//=====================================ALTERA NOME DA CATEGORIA PELO ID=======================================

router.put('/:id',(request, response) => {

    const categoryID = request.params.id
    const categoryName = request.body.categoryName

    if(categoryID){

        database.serialize(() => {

            const updateCategory = 'UPDATE category SET category_name = ? WHERE category_id = ?'

            database.run(updateCategory, [categoryName, categoryID], (error) =>{

                if(error){
                    response.status(404).json({sucess: false, error: error.message})
                }else{
                    response.status(200).json({sucess: 'Categoria alterada com sucesso!', error: false})
                }
            })
        })
    }
})

//============================================================================================================

module.exports = router 