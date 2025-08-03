package com.GroupProject.ItemService.Entity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public enum ItemType {
    RENT,
    SELL;

    private static final Logger logger = LoggerFactory.getLogger(ItemType.class);

    static {
        logger.info("ItemType enum loaded with values: RENT, SELL");
    }
}
