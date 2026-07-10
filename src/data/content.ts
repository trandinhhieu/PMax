import type { Locale, LocalizedText } from "@/types/common";

export const copy = {
  en: {
    nav: {
      menu: "Menu",
      booking: "Book",
      directions: "Directions",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Near My Khe Beach — Open Tonight",
      title: "Wood-fired Pizza & Tacos / Near My Khe Beach",
      body: "Fresh dough, blistered crusts, loaded tacos, cold drinks, and easy open-air tables just minutes from the beach.",
      trustLine: "★ 4.8 guest rating • Open daily 4 PM - 11 PM • Free delivery within 3 km",
      directions: "Get Directions",
      menu: "View Menu",
      booking: "Book a Table",
    },
    sections: {
      trustTitle: "Open daily near My Khe",
      whyTitle: "Easy dinner after the beach",
      whyBody:
        "Hermanos brings together smoky wood-fired pizza, shareable plates and a relaxed neighborhood atmosphere for date nights, groups and casual dinners.",
      signatureTitle: "Wood-fired favorites for the table",
      signatureBody: "Start with pizza from the oven, then add tacos, wings, salads and cold drinks to share.",
      menuTitle: "Wood-fired favorites for the table",
      menuBody: "Start with pizza from the oven, then add tacos, wings, salads, and cold drinks to share.",
      galleryTitle: "Food-first, warm and casual",
      galleryBody: "Real menu photos help visitors inspect the food before they decide where to go.",
      reviewsTitle: "Easy nights, warm service, real wood-fired pizza",
      reviewsBody: "Open the public profiles for current photos, directions, updates and customer feedback.",
      bookingTitle: "Book a table for tonight",
      bookingBody: "Send a quick request and the Hermanos team can confirm your table by phone or chat.",
      mapTitle: "Find Hermanos in Son Tra",
      mapBody: "Open Google Maps for directions or copy the address for your driver.",
      contactTitle: "Contact Hermanos",
    },
    form: {
      name: "Name",
      phone: "Phone or WhatsApp",
      channel: "Preferred contact",
      date: "Date",
      time: "Time",
      guests: "Guests",
      note: "Note",
      submit: "Send booking request",
      privacy: "We only use your contact information to confirm your reservation request.",
      success: "Your booking request has been sent. Hermanos will confirm through your preferred contact channel.",
      error: "We could not send your request. Please call us or message Hermanos directly and we will help you book.",
    },
  },
  vi: {
    nav: {
      menu: "Menu",
      booking: "Đặt bàn",
      directions: "Chỉ đường",
      contact: "Liên hệ",
    },
    hero: {
      eyebrow: "Gần biển Mỹ Khê — Mở cửa tối nay",
      title: "Pizza nướng củi & Taco / Gần biển Mỹ Khê",
      body: "Bột bánh tươi, viền bánh cháy xém, taco đầy đặn, đồ uống mát lạnh và bàn ngoài trời thoáng mát, chỉ vài phút từ bãi biển.",
      trustLine: "★ 4.8 đánh giá khách hàng • Mở cửa 16:00 - 23:00 • Miễn phí giao hàng dưới 3 km",
      directions: "Chỉ đường",
      menu: "Xem menu",
      booking: "Đặt bàn",
    },
    sections: {
      trustTitle: "Mở cửa hằng ngày gần Mỹ Khê",
      whyTitle: "Bữa tối dễ chịu sau khi đi biển",
      whyBody:
        "Hermanos kết hợp pizza thơm mùi lò củi, các món dễ chia sẻ và không khí thân thiện cho hẹn hò, nhóm bạn và bữa tối thoải mái.",
      signatureTitle: "Món nướng củi dễ chia sẻ",
      signatureBody: "Bắt đầu với pizza từ lò củi, rồi thêm taco, cánh gà, salad và đồ uống mát lạnh để chia sẻ.",
      menuTitle: "Món nướng củi dễ chia sẻ",
      menuBody: "Bắt đầu với pizza từ lò củi, rồi thêm taco, cánh gà, salad và đồ uống mát lạnh để chia sẻ.",
      galleryTitle: "Món ăn thật, cảm giác ấm áp",
      galleryBody: "Ảnh món ăn thật giúp khách xem kỹ hơn trước khi quyết định đến quán.",
      reviewsTitle: "Buổi tối dễ chịu, phục vụ ấm áp, pizza nướng củi thật",
      reviewsBody: "Mở các hồ sơ công khai để xem ảnh mới, chỉ đường, cập nhật và phản hồi khách hàng.",
      bookingTitle: "Đặt bàn cho tối nay",
      bookingBody: "Gửi yêu cầu nhanh, team Hermanos sẽ xác nhận lại qua điện thoại hoặc chat.",
      mapTitle: "Tìm Hermanos tại Sơn Trà",
      mapBody: "Mở Google Maps để chỉ đường hoặc copy địa chỉ gửi cho tài xế.",
      contactTitle: "Liên hệ Hermanos",
    },
    form: {
      name: "Tên",
      phone: "Điện thoại hoặc WhatsApp",
      channel: "Kênh liên hệ",
      date: "Ngày",
      time: "Giờ",
      guests: "Số khách",
      note: "Ghi chú",
      submit: "Gửi yêu cầu đặt bàn",
      privacy: "Thông tin liên hệ chỉ được dùng để xác nhận yêu cầu đặt bàn.",
      success: "Yêu cầu đặt bàn đã được gửi. Hermanos sẽ xác nhận qua kênh liên hệ bạn chọn.",
      error: "Hermanos chưa gửi được yêu cầu. Vui lòng gọi hoặc nhắn tin trực tiếp để được hỗ trợ đặt bàn.",
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;

export const gallery = [
  {
    src: "/images/food/hero-pizza-tacos.jpeg",
    alt: {
      en: "Pizza and tacos served together at Hermanos",
      vi: "Pizza và taco được phục vụ cùng nhau tại Hermanos",
    },
  },
  {
    src: "/images/food/pizza-closeup.jpeg",
    alt: {
      en: "Close-up of wood-fired pizza crust and tomato",
      vi: "Cận cảnh đế pizza nướng củi và cà chua",
    },
  },
  {
    src: "/images/food/tacos.jpeg",
    alt: {
      en: "Fresh tacos with herbs and colorful vegetables",
      vi: "Taco tươi với rau thơm và rau củ nhiều màu",
    },
  },
  {
    src: "/images/food/burger.jpeg",
    alt: {
      en: "Burger served on a wooden board",
      vi: "Burger phục vụ trên thớt gỗ",
    },
  },
] satisfies Array<{ src: string; alt: LocalizedText }>;

export const trustItems = {
  en: ["Open daily 4:00 PM - 11:00 PM", "169 To Hien Thanh, Son Tra", "Wood-fired pizza", "Free delivery within 3 km"],
  vi: ["Mở cửa hằng ngày 16:00 - 23:00", "169 Tô Hiến Thành, Sơn Trà", "Pizza nướng củi", "Miễn phí giao hàng dưới 3 km"],
} satisfies Record<Locale, string[]>;

export const reviewSources = {
  en: [
    ["Google Maps", "Current directions, photos and customer feedback."],
    ["Tripadvisor", "Helpful for travelers comparing restaurants in Da Nang."],
    ["Facebook", "Messages, updates and local community signals."],
  ],
  vi: [
    ["Google Maps", "Chỉ đường, hình ảnh và phản hồi khách hàng mới nhất."],
    ["Tripadvisor", "Hữu ích cho du khách khi so sánh quán ăn tại Đà Nẵng."],
    ["Facebook", "Tin nhắn, cập nhật và tín hiệu cộng đồng địa phương."],
  ],
} satisfies Record<Locale, Array<[string, string]>>;

export const faq = {
  en: [
    ["Do you accept reservations?", "Yes. Send a booking request and Hermanos will confirm through your preferred contact channel."],
    ["Are you near My Khe Beach?", "Yes, Hermanos is in Son Tra, Da Nang, near the My Khe area."],
    ["Do you offer takeaway or delivery?", "Please contact the restaurant directly for current takeaway and delivery options."],
  ],
  vi: [
    ["Hermanos có nhận đặt bàn không?", "Có. Bạn có thể gửi yêu cầu đặt bàn và Hermanos sẽ xác nhận qua kênh liên hệ bạn chọn."],
    ["Quán có gần biển Mỹ Khê không?", "Có, Hermanos nằm ở khu Sơn Trà, Đà Nẵng, gần khu Mỹ Khê."],
    ["Có takeaway hoặc giao hàng không?", "Vui lòng liên hệ trực tiếp với quán để kiểm tra lựa chọn takeaway và giao hàng hiện tại."],
  ],
} satisfies Record<Locale, Array<[string, string]>>;
