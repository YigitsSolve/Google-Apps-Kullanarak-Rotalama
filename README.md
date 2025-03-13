Önemli not Route Planner.gs aalışmıyorsa Route Planlama.gs ile deneyin.
# En Yakın Komşu Rotası Hesaplama Scripti

Bu repository, Google Sheets üzerinde çalışan ve belirlenen bir başlangıç noktasından diğer noktalara en kısa mesafeyi hesaplayarak en yakın komşu rotasını optimize eden bir Google Apps Script içerir.

## Özellikler

- Bir başlangıç noktasından, liste halinde verilen diğer noktalara kadar en kısa yolları hesaplar.
- Hesaplanan rota bilgilerini yeni bir Google Sheets sekmesinde "Optimized Route" adıyla listeler.
- Toplam yol mesafesini ve her adımın süresini gösterir.

## Kurulum

Bu scripti kullanabilmek için aşağıdaki adımları izleyin:

1. Google Sheets dokümanınızı açın.
2. Script editörünü açmak için `Extensions > Apps Script` menüsüne gidin.
3. Yeni bir script dosyası oluşturun ve bu repository'deki kodu kopyalayıp yapıştırın.
4. `onOpen` fonksiyonunu çalıştırarak menüyü etkinleştirin.
5. Google Sheets menünüzde belirecek olan "Route" menüsünden "Plan Nearest Neighbor Route" seçeneğini seçerek scripti çalıştırın.

## Nasıl Çalışır?

- Script, aktif sayfanın B sütunundaki adresleri kullanarak bir rota hesaplar.
- Başlangıç noktası olarak B1 hücresindeki adresi, diğer adresler olarak ise B2 hücresinden başlayarak alt alta sıralanmış adresleri kullanır.
- Her bir adres için Google Maps API aracılığıyla mesafe ve süre hesaplanır.
- En kısa mesafe bulunduğunda, bu nokta rota üzerinde bir sonraki nokta olarak eklenir ve işlem, hedef adresler tükenene kadar devam eder.
