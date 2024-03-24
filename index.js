const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const url = 'http://localhost:8000/whisper/';
const folderPath = 'audio';

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error("Ошибка при чтении папки:", err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
            const form = new FormData();
            form.append('files', fs.createReadStream(filePath), file);

            axios.post(url, form, {
                headers: {
                    ...form.getHeaders(),
                },
            })
              .then(response => {
                  if (response.status === 200) {
                      console.log(`Файл ${file} успешно обработан.`);
                      console.log(response.data);
                  } else {
                      console.log(`Ошибка обработки файла ${file}. Статус: ${response.status}`);
                  }
              })
              .catch(error => {
                  console.error(`Ошибка при отправке файла ${file}:`, error);
              });
        }
    });
});