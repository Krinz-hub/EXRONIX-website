import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: Request) {
  try {
    // =====================================================
    // SERVER ENVIRONMENT VARIABLES
    // =====================================================

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("DELETE ACCOUNT ENV CHECK:", {
      supabaseUrl: !!supabaseUrl,
      serviceRoleKey: !!serviceRoleKey,
    });

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase server environment variables.");

      return NextResponse.json(
        {
          error: "Server configuration is incomplete.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // GET ACCESS TOKEN
    // =====================================================

    const authorization = request.headers.get("authorization");

    console.log(
      "Authorization header exists:",
      !!authorization
    );

    if (!authorization) {
      return NextResponse.json(
        {
          error: "No Authorization header received.",
        },
        { status: 401 }
      );
    }

    if (
      !authorization
        .toLowerCase()
        .startsWith("bearer ")
    ) {
      return NextResponse.json(
        {
          error:
            "Authorization header is not Bearer format.",
        },
        { status: 401 }
      );
    }

    const accessToken = authorization
      .substring(7)
      .trim();

    console.log(
      "Access token exists:",
      !!accessToken
    );

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Access token is empty.",
        },
        { status: 401 }
      );
    }

    // =====================================================
    // CREATE SERVER-ONLY SUPABASE ADMIN CLIENT
    // =====================================================

    const adminSupabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // =====================================================
    // VERIFY CURRENT USER
    // =====================================================

    const {
      data: { user },
      error: userError,
    } = await adminSupabase.auth.getUser(
      accessToken
    );

    if (userError) {
      console.error(
        "SUPABASE GET USER ERROR:",
        userError
      );

      return NextResponse.json(
        {
          error:
            userError.message ||
            "Unable to verify user.",
        },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Authenticated user not found.",
        },
        { status: 401 }
      );
    }

    console.log(
      "Authenticated user:",
      user.id
    );

    // =====================================================
    // DELETE AUTH USER
    // =====================================================

    const {
      error: deleteError,
    } =
      await adminSupabase.auth.admin.deleteUser(
        user.id
      );

    if (deleteError) {
      console.error(
        "SUPABASE ACCOUNT DELETE ERROR:",
        deleteError
      );

      return NextResponse.json(
        {
          error:
            deleteError.message ||
            "Failed to delete account.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // SUCCESS
    // =====================================================

    console.log(
      "Account deleted successfully:",
      user.id
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Account deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE ACCOUNT ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}