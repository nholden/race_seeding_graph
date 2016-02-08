require 'nokogiri'
require 'json'

table = File.open("race_results.html") { |f| Nokogiri::HTML(f) }
results = []

table.xpath("//tr").each do |result|
  results.push({ rank:         result.xpath("td[2]").text,
                 name:         result.xpath("td[3]").text,
                 bib:          result.xpath("td[4]").text,
                 city:         result.xpath("td[5]").text,
                 gunTime:      result.xpath("td[6]").text,
                 gunPace:      result.xpath("td[7]").text[0..-2],
                 chipTime:     result.xpath("td[8]").text,
                 chipPace:     result.xpath("td[9]").text[0..-2],
                 speed:        result.xpath("td[10]").text,
                 ageGroupRank: result.xpath("td[11]").text,
                 ageGroup:     result.xpath("td[12]").text })
end

File.open("race_results.json","w") do |f|
  f.write(JSON.pretty_generate(results))
end
