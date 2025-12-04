

  document.getElementById("export-pdf").addEventListener("click", function() {
    const element = document.querySelector(".panel-content"); // content to export
    const opt = {
      margin:       10,
      filename:     'Professional_Timeline.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  });
