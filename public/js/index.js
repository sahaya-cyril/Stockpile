$(function () {
    $("#ddlitem").change(function () {
        $(this).find("option:selected").text();
        const item = $(this).val();
        console.log(item);
        const elements = item.split(",");

        document.getElementById("price").value = elements[0];
        document.getElementById("quantity").value = 0;
        document.getElementById("stock").value = elements[2];
    });
    $(".input").on('input', function() {
        var quantity = document.getElementById("quantity").value;
        quantity = parseFloat(quantity);

        var price = document.getElementById("price").value;
        price = parseFloat(price);

        var stock = document.getElementById("stock").value;
        stock = parseFloat(stock);

        if(Number.isNaN(quantity)) {
            quantity = 0;
        }
        document.getElementById("total").value = quantity * price;

        var currsto = document.getElementById("currentStock").value = stock + quantity;
        console.log("st: " + stock);
        console.log("cs: " + currsto);
    });
});