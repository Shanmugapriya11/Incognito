    
module.exports = {
    generatingPDF: function generatingPDF(){
        doc = new PDF();                        
        doc.pipe(fs.createWriteStream('output.pdf'));  //creating a write stream 

        doc.fontSize(15)
        .text("---------------------------------------------------------------------------------")
        .fontSize(25)
        .text('Women @ Freshdesk')
        .fontSize(15)
        .text("---------------------------------------------------------------------------------");

        db.all_messages(function(result) {
            if(result){
                for(i=0;i<result.length;i++) {
                    doc.fontSize(12).text(result[i]['username']+ " : ");
                    doc.fontSize(10).text(result[i]['message'], {paragraphGap: 10,indent: 20,align: 'justify',});
                }
            }       
            doc.end(); 
        });
    }
};