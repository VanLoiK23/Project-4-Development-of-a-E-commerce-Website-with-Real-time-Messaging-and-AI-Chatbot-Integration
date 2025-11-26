package com.thuongmaidientu.service.impl;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.or;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.bson.conversions.Bson;

import com.fatboyindustrial.gsonjavatime.Converters;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.InsertOneResult;
import com.thuongmaidientu.dto.ChatMessageDTO;
import com.thuongmaidientu.service.IChatMessageService;
import com.thuongmaidientu.util.MongoUtil;

public class ChatMessageService implements IChatMessageService{

	private final MongoCollection<Document> messageCollection;
	private final Gson gson = Converters.registerAll(new GsonBuilder()).setDateFormat("EEE MMM dd HH:mm:ss z yyyy")
			.create();

	public ChatMessageService() {
		MongoDatabase db = MongoUtil.getDatabase();
		messageCollection = db.getCollection("messages");
	}

	@Override
	public Boolean saveMessage(ChatMessageDTO saveChatMessage) {

		InsertOneResult result = messageCollection.insertOne(saveChatMessage.toDocument());

		if (result.wasAcknowledged()) {
			return true;
		}
		
		return false;
	}

	@Override
	public List<ChatMessageDTO> getAllMessages() {
		List<ChatMessageDTO> result = new ArrayList<>();

		FindIterable<Document> documents = messageCollection.find();
		try (MongoCursor<Document> cursor = documents.iterator()) {
			while (cursor.hasNext()) {
				ChatMessageDTO message = gson.fromJson(cursor.next().toJson(), ChatMessageDTO.class);
				result.add(message);
			}
		}

		return result;
	}

	@Override
	public List<ChatMessageDTO> getMessagesBetween(String userA, String userB) {
		List<ChatMessageDTO> result = new ArrayList<>();
		Bson filter;

		filter = or(and(eq("senderId", userA), eq("receiverId", userB)),
				and(eq("senderId", userB), eq("receiverId", userA)));

		FindIterable<Document> documents = messageCollection.find(filter).sort(Sorts.ascending("timestamp"));

		try (MongoCursor<Document> cursor = documents.iterator()) {
			while (cursor.hasNext()) {
				ChatMessageDTO message = gson.fromJson(cursor.next().toJson(), ChatMessageDTO.class);
				result.add(message);
			}
		}

		return result;
	}
}
