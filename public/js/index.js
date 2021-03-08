$(function () {
    $("#ddlitem").change(function () {
        $(this).find("option:selected").text();
        const item = $(this).val();
        const elements = item.split(",")

        document.getElementById("price").value = elements[0];
        document.getElementById("quantity").value = elements[1];
        document.getElementById("stock").value = elements[2];
    });
    $(".input").on('input', function() {
        var quantity = document.getElementById("quantity").value;
        quantity = parseFloat(quantity);

        var price = document.getElementById("price").value;
        price = parseFloat(price);

        if(Number.isNaN(quantity)) {
            quantity = 0;
        }
        document.getElementById("total").value = quantity * price;
        console.log(quantity + price);
    });
});