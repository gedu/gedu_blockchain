// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract LemonadeStand {
    address owner;
    uint256 skuCount;

    enum State {
        ForSale,
        Sold,
        Shipped
    }

    //The lemonade
    struct Item {
        string name;
        uint256 sku;
        uint256 price;
        State state;
        address payable seller;
        address buyer;
    }

    //sku number to item/lemonade
    mapping(uint256 => Item) items;

    event ForSale(uint256 skuCount);
    event Sold(uint256 sku);
    event Shipped(uint256 sku);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier verifyCaller(address _address) {
        require(msg.sender == _address);
        _;
    }

    modifier paidEnough(uint256 price) {
        require(msg.value >= price);
        _;
    }

    modifier forSale(uint256 _sku) {
        require(items[_sku].state == State.ForSale);
        _;
    }

    modifier sold(uint256 _sku) {
        require(items[_sku].state == State.Sold);
        _;
    }

    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValue(uint256 _sku) {
        _;
        uint256 _price = items[_sku].price;
        uint256 amountToRefund = msg.value - _price;
        payable(items[_sku].buyer).transfer(amountToRefund);
    }

    constructor() {
        owner = msg.sender;
        skuCount = 0;
    }

    function addItem(string memory _name, uint256 _price) public onlyOwner {
        skuCount = skuCount + 1;

        emit ForSale(skuCount);

        items[skuCount] = Item({
            name: _name,
            sku: skuCount,
            price: _price,
            state: State.ForSale,
            seller: payable(msg.sender),
            buyer: address(0)
        });
    }

    function buyItem(uint256 _sku)
        public
        payable
        forSale(_sku)
        paidEnough(items[_sku].price)
    /*checkValue(_sku) we can use the modifier or implement it*/
    {
        uint256 price = items[_sku].price;

        items[_sku].buyer = msg.sender;
        items[_sku].state = State.Sold;
        items[_sku].seller.transfer(price);

        uint256 cashBack = msg.value - price;

        if (cashBack > 0) {
            payable(msg.sender).transfer(cashBack);
        }

        emit Sold(_sku);
    }

    function fetchItem(uint256 _sku)
        public
        view
        returns (
            string memory name,
            uint256 sku,
            uint256 price,
            string memory stateIs,
            address seller,
            address buyer
        )
    {
        name = items[_sku].name;
        sku = items[_sku].sku;
        price = items[_sku].price;
        uint256 state = uint256(items[_sku].state);
        stateIs = (state == 0) ? "For Sale" : "SOLD";
        seller = items[_sku].seller;
        buyer = items[_sku].buyer;
    }

    function shipItem(uint256 _sku)
        public
        sold(_sku)
        verifyCaller(items[_sku].seller)
    {
        items[_sku].state = State.Shipped;

        emit Shipped(_sku);
    }
}
