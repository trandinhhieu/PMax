$path = 'tests/booking-form-invalid.spec.ts'
$content = Get-Content -LiteralPath $path -Raw
$content = $content.Replace('await page.getByRole("button", { name: /16:00/ }).first().click();', 'await page.getByRole("button", { name: /Available|Còn trống|Limited|Sắp hết/i }).first().click();')
$content = $content.Replace('await expect(page.locator("#booking-contact-error")).toContainText(/há»£p lá»‡|phone/i);', 'await expect(page.locator("#booking-contact-error")).toContainText(/hợp lệ/i);')
Set-Content -LiteralPath $path -Value $content -Encoding utf8

$path = 'tests/booking-form-vi.spec.ts'
$content = Get-Content -LiteralPath $path -Raw
$content = $content.Replace('  await page.getByRole("heading", { name: /Äáº·t bÃ n cho tá»‘i nay|Booking/i }).scrollIntoViewIfNeeded();`r`n', '')
$content = $content.Replace('await page.getByRole("button", { name: /16:00/ }).first().click();', 'await page.getByRole("button", { name: /Available|Còn trống|Limited|Sắp hết/i }).first().click();')
Set-Content -LiteralPath $path -Value $content -Encoding utf8
