package com.fruitecom.backend.config;

import com.fruitecom.backend.entity.Product;
import com.fruitecom.backend.entity.User;
import com.fruitecom.backend.entity.UserAddress;
import com.fruitecom.backend.repository.ProductRepository;
import com.fruitecom.backend.repository.UserAddressRepository;
import com.fruitecom.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initProducts();
        initDemoUser();
    }

    private void initProducts() {
        List<Product> products = List.of(
                create("云南蓝莓", "浆果", "云南", "果粉丰富，酸甜平衡", "花青素、维生素C", "https://images.pexels.com/photos/19650387/pexels-photo-19650387.jpeg", 39.90, 200, true, true),
                create("阿克苏苹果", "仁果", "新疆", "脆甜多汁，糖心明显", "膳食纤维、钾", "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb", 15.80, 500, true, false),
                create("海南金钻凤梨", "热带", "海南", "香味浓郁，免挖眼", "维生素B族、菠萝蛋白酶", "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1", 29.90, 160, false, true),
                create("智利车厘子", "浆果", "智利", "果肉饱满，甜度高", "铁、维生素C", "https://images.unsplash.com/photo-1528825871115-3581a5387919", 89.00, 120, true, true),
                create("赣南脐橙", "柑橘", "江西", "皮薄汁多，酸甜适中", "维生素C、叶酸", "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b", 19.90, 300, false, false),
                create("山东香梨", "仁果", "山东", "细腻清甜，口感脆嫩", "膳食纤维、铜", "https://images.unsplash.com/photo-1502741126161-b048400d3d1e", 18.50, 260, false, false),
                create("泰国椰青", "热带", "泰国", "椰水清甜，低脂健康", "电解质、钾", "/images/泰国椰青.jpg", 12.90, 400, false, true),
                create("越南红心火龙果", "热带", "越南", "果肉细腻，甜度高", "膳食纤维、花青素", "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec", 23.90, 280, true, true),
                create("四川耙耙柑", "柑橘", "四川", "皮薄易剥，果肉细嫩少渣", "维生素C、柠檬酸", "https://images.unsplash.com/photo-1519096845289-95806ee03a1a", 22.80, 260, true, true),
                create("福建平和蜜柚", "柑橘", "福建", "柚香清新，甜中带微酸", "膳食纤维、维生素C", "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11", 25.90, 220, false, false),
                create("广西沃柑", "柑橘", "广西", "高糖低酸，汁水充沛", "维生素C、钾", "https://images.unsplash.com/photo-1557800636-894a64c1696f", 21.50, 320, true, true),
                create("云南阳光玫瑰葡萄", "浆果", "云南", "果粒饱满，玫瑰香明显", "葡萄多酚、维生素K", "https://images.unsplash.com/photo-1537640538966-79f369143f8f", 36.80, 190, true, false),
                create("丹东草莓", "浆果", "辽宁", "酸甜平衡，香气浓郁", "维生素C、叶酸", "https://images.unsplash.com/photo-1518635017498-87f514b751ba", 32.90, 210, true, true),
                create("新疆哈密瓜", "热带", "新疆", "瓜瓤细腻，甜度稳定", "胡萝卜素、维生素C", "https://images.unsplash.com/photo-1571575173700-afb9492e6a50", 27.80, 240, false, true),
                create("海南贵妃芒", "热带", "海南", "果香浓郁，纤维少", "维生素A、维生素C", "https://images.unsplash.com/photo-1553279768-865429fa0078", 34.50, 180, true, true),
                create("广西百香果", "热带", "广西", "果香浓烈，酸甜开胃", "维生素C、膳食纤维", "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46", 16.90, 380, false, true),
                create("新疆红富士", "仁果", "新疆", "高海拔种植，清甜爽脆", "膳食纤维、钾", "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a", 17.60, 460, false, false),
                create("河北皇冠梨", "仁果", "河北", "果肉细白，汁多化渣", "膳食纤维、铜", "https://images.pexels.com/photos/28773716/pexels-photo-28773716.jpeg", 16.80, 350, false, false),
                create("烟台奶油富士", "仁果", "山东", "糖酸比均衡，口感细腻", "果胶、钾", "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb", 19.80, 340, true, false),
                create("广东砂糖橘", "柑橘", "广东", "小果易剥，甜度高", "维生素C、类黄酮", "https://images.unsplash.com/photo-1557800636-894a64c1696f", 14.90, 520, true, true),
                create("湖北伦晚脐橙", "柑橘", "湖北", "果肉细嫩，风味清甜", "维生素C、叶酸", "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b", 20.60, 280, false, false),
                create("云南释迦果", "热带", "云南", "奶香软糯，甜度高", "维生素B6、钾", "https://images.unsplash.com/photo-1528825871115-3581a5387919", 31.90, 130, false, true),
                create("福建青皮香蕉", "热带", "福建", "果肉绵密，甜味自然", "钾、维生素B6", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e", 13.50, 420, false, false),
                create("秘鲁蓝莓", "浆果", "秘鲁", "颗粒均匀，酸甜爽口", "花青素、维生素C", "https://images.pexels.com/photos/5178561/pexels-photo-5178561.jpeg", 42.90, 150, true, true),
                create("云南软籽石榴", "浆果", "云南", "籽软多汁，甜中微酸", "维生素C、多酚", "https://images.unsplash.com/photo-1541344999736-83eca272f6fc", 26.40, 240, false, false)
        );

        List<Product> existingProducts = productRepository.findAll();
        Set<String> existingNames = new HashSet<>(existingProducts.stream().map(Product::getName).toList());

        List<Product> missingProducts = products.stream()
                .filter(product -> !existingNames.contains(product.getName()))
                .toList();

        if (!missingProducts.isEmpty()) {
            productRepository.saveAll(missingProducts);
        }

        List<Product> allProducts = productRepository.findAll();
        List<Product> imageFixProducts = new ArrayList<>();
        for (Product product : allProducts) {
            String fixedImage = switch (product.getName()) {
                case "河北皇冠梨" -> "https://images.pexels.com/photos/28773716/pexels-photo-28773716.jpeg";
                case "云南蓝莓" -> "https://images.pexels.com/photos/19650387/pexels-photo-19650387.jpeg";
                case "秘鲁蓝莓" -> "https://images.pexels.com/photos/5178561/pexels-photo-5178561.jpeg";
                default -> null;
            };

            if (fixedImage != null && !Objects.equals(product.getCoverImage(), fixedImage)) {
                product.setCoverImage(fixedImage);
                imageFixProducts.add(product);
            }
        }

        if (!imageFixProducts.isEmpty()) {
            productRepository.saveAll(imageFixProducts);
        }

        List<Product> peruBlueberries = allProducts.stream()
                .filter(product -> "秘鲁蓝莓".equals(normalizeName(product.getName())))
                .filter(product -> "ON_SALE".equals(product.getStatus()))
                .sorted(Comparator.comparing(Product::getId))
                .toList();

        if (peruBlueberries.size() > 1) {
            List<Product> duplicatedOnSaleProducts = new ArrayList<>();
            for (int i = 1; i < peruBlueberries.size(); i++) {
                Product duplicate = peruBlueberries.get(i);
                duplicate.setStatus("OFF_SALE");
                duplicatedOnSaleProducts.add(duplicate);
            }
            productRepository.saveAll(duplicatedOnSaleProducts);
        }
    }

    private String normalizeName(String name) {
        if (name == null) {
            return "";
        }
        return name.replaceAll("\\s+", "");
    }

    private void initDemoUser() {
        User user = userRepository.findByUsername("demo").orElseGet(() -> userRepository.save(User.builder()
                .username("demo")
                .phone("13800000000")
                .passwordHash(passwordEncoder.encode("123456"))
                .status("ACTIVE")
                .build()));

        if (userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(user.getId()).isEmpty()) {
            userAddressRepository.save(UserAddress.builder()
                    .userId(user.getId())
                    .receiver("演示用户")
                    .phone("13800000000")
                    .province("广东省")
                    .city("深圳市")
                    .detailAddress("南山区科技园1号")
                    .isDefault(true)
                    .build());
        }
    }

    private Product create(String name,
                           String category,
                           String origin,
                           String desc,
                           String nutrition,
                           String image,
                           double price,
                           int stock,
                           boolean featured,
                           boolean seasonal) {
        return Product.builder()
                .name(name)
                .category(category)
                .originPlace(origin)
                .description(desc)
                .nutritionInfo(nutrition)
                .coverImage(image)
                .price(BigDecimal.valueOf(price))
                .stock(stock)
                .sales(0)
                .featured(featured)
                .seasonal(seasonal)
                .status("ON_SALE")
                .build();
    }
}
