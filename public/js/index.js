$(function () {
    $("#ddlitem").change(function () {
        $(this).find("option:selected").text();
        const item = $(this).val();
        const elements = item.split(",");

        document.getElementById("price").value = elements[1];
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
        document.getElementById("amount").value = quantity * price;
        
        if(document.getElementById("#addItemBtn").value === "sell") {
            document.getElementById("currentStock").value = stock - quantity;
        } else {
            document.getElementById("currentStock").value = stock + quantity;
        }
    });
});